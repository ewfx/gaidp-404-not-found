from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from pdfminer.high_level import extract_text
from markdownify import markdownify as md
from typing import Literal, Callable
import pandas as pd
import inspect
import re


class Schema(BaseModel):
    name: str
    pages: list[int]


class SchemaExtractionOutput(BaseModel):
    schemas: list[Schema]


class ColumnsExtractionOutput(BaseModel):
    columns: list[str]


class Rule(BaseModel):
    columns: list[str]
    description: str
    category: Literal["record", "batch"]


class RuleModificationOutput(BaseModel):
    rule: Rule


class RulesExtractionOutput(BaseModel):
    rules: list[Rule]


class RecordCodeGeneratorOutput(BaseModel):
    code: Callable[[pd.Series], bool]


class BatchCodeGeneratorOutput(BaseModel):
    code: Callable[[pd.DataFrame], bool]


class CrewAI:

    def __init__(self):
        self.llm = LLM(
            model="sambanova/DeepSeek-R1-Distill-Llama-70B",
            temperature=0.7,
            max_tokens=100000,
        )
        self.schema_extraction_agent = Agent(
            role="Pdf Data Extractor",
            goal="Extracting diffrent schema from the given PDF content and keeping track of the page numbers that belong to that particular schema.",
            backstory="You are an expert in PDF Data extraction.",
            verbose=True,
            llm=self.llm,
        )
        self.schema_extraction_task = Task(
            description="""From the given pdf: 
            
            {content}
            
            Extract the potential table names (we refer to table as schema here)
            Do not miss out on any table names. 
            Document the page numbers that contain details regarding an identified table. 
            Return the Schema/Table name and pages array in a structured format.
            Even if the paragraphs remotely resemble a table like structure or a field like pattern, consider them as tables""",
            agent=self.schema_extraction_agent,
            output_pydantic=SchemaExtractionOutput,
            expected_output="A response containing all the extracted schemas along with page numbers.",
        )
        self.columns_extraction_agent = Agent(
            role="Column Extracter Agent",
            goal="Extracting column names from the PDF that will be used for CSV profiling is it's major goal.",
            backstory="Diligently and accurately working to extract column names from the PDF that will be used for CSV profiling.",
            verbose=True,
            llm=self.llm,
        )
        self.columns_extraction_task = Task(
            description="""From the given pdf: 
            
            {content}
            
            Extract the column names for the schema {schema_name} and document them in a structured format.
            Do not miss out on any column names.
            The column names are later required for rule validation of another csv.
            Dont Extract column names that are used to describe the tables in pdf,
            instead extract the column names that will be present in the csv that will be used later...""",
            agent=self.columns_extraction_agent,
            output_pydantic=ColumnsExtractionOutput,
            expected_output="A response containing all the extracted columns that will be present in the csv.",
        )
        self.rules_extraction_agent = Agent(
            role="Rules Extracter Agent",
            goal="Extract precise rules from the pdf content and document it.",
            backstory="An AI Data Analyst with expertise in generating Data Profiling rules from the given content",
            verbose=True,
            llm=self.llm,
        )
        self.rules_extraction_task = Task(
            description="""From the given pdf:
            pdf content: 
            
            {content}

            And csv with columns: {columns}

            user prompt:{prompt}

            Extract the rules for schema {schema} relevant to the columns and document them in a structured format with columns needed and category.
            The rule description you extract should be precise as another LLM agent will used in future to convert that into python code 
            Do not miss out on any rules.
            And for each rule, document the columns involved to validate that rule in columns_needed variable.
            And for each rule, document the category of that rule in category variable("record" or "batch").
            And for each rule, doc
            Document even the simplest rules that can be extracted from the content that can be used for validating csv later.
            """,
            agent=self.rules_extraction_agent,
            output_pydantic=RulesExtractionOutput,
            expected_output="A response containing all the extracted/generated rules and the columns involved in each rule.",
        )
        self.rules_modification_agent = Agent(
            role="Rules modifier Agent",
            goal="Modify the given rule referring to the task given to you",
            backstory="An expert in modifying rules according to user needs",
            verbose=True,
            llm=self.llm,
        )
        self.rules_modification_task = Task(
            description="""From the given parameters 
            pdf content: 
            
            {content}

            And csv with columns: {columns}
            previous rule:{rule}
            user prompt:{prompt}

            Understand the user prompt clearly.
            Then refer to the pdf content,columns and the previous rule to update the existing rule for the schema {schema}.
            And for each rule, document the columns involved to validate that rule in columns_needed variable.
            And for each rule, document the category of that rule in category variable("record" or "batch").
            """,
            agent=self.rules_modification_agent,
            output_pydantic=RuleModificationOutput,
            expected_output="A response containing all the modified rule",
        )
        self.code_generator_agent = Agent(
            role="Code Generator",
            goal="Generate a correct and efficient Python function.",
            backstory="An AI expert in Python, writing optimal code for any problem statement and debugs wrong code.",
            verbose=True,
            llm=self.llm,
        )
        self.record_code_generation_task = Task(
            description="""From the given parameters 
            pdf content: 
            
            {content}

            And csv with columns: {columns}
            current rule:{rule}
            user prompt:{prompt}

            Understand the user prompt clearly. Understand the current rule clearly.
            Then refer to the pdf content,columns and the current rule's columns to generate python code to validate the rule on schema {schema}.

            Your job is to provide a valid python function to validate the columns mentioned in the rule and the relation between then as explained in the rule.
            If you python function causes error, then rewrite it and execute it to find any logical or syntactical errors in the code and fix it.
            Return thr python function as a string.

            Output Format: code: Callable[[pd.Series], bool]

            Code Must be of the form: 
            
```python
# Imports
import pandas as pd

def function_name(row: pd.Series) -> bool:

    # Your code here

    return result
```

            """,
            agent=self.code_generator_agent,
            expected_output="A valid Python function as a string.",
        )
        self.batch_code_generation_task = Task(
            description="""From the given parameters 
            pdf content: 
            
            {content}

            And csv with columns: {columns}
            current rule:{rule}
            user prompt:{prompt}

            Understand the user prompt clearly. Understand the current rule clearly.
            Then refer to the pdf content,columns and the current rule's columns to generate python code to validate the rule on schema {schema}.
            
            Your job is to provide a valid python function to validate the columns mentioned in the rule and the relation between then as explained in the rule.
            If you python function causes error, then rewrite it and execute it to find any logical or syntactical errors in the code and fix it.
            Return thr python function as a string.

            Output Format: code: Callable[[pd.DataFrame], bool]

            Code Must be of the form:

```python
# Imports
import pandas as pd

def function_name(df: pd.DataFrame) -> bool:

    # Your code here

    return result
```

            """,
            agent=self.code_generator_agent,
            expected_output="A valid Python function as a string.",
        )

    # Function to check logical errors using a dry run
    @staticmethod
    def check_logical_errors(code_str):
        try:
            code = CrewAI.extract_code(code_str)
            ast.parse(code_str)  # Parses the code to check for syntax errors
            exec_globals = {}
            exec(code_str, exec_globals)
            return None  # No logical errors
        except Exception as e:
            return str(e)  # Return error message

    @staticmethod
    def extract_code(text):
        match = re.search(r"```python\n(.*?)```", text, re.DOTALL)
        return match.group(1)

    async def generate_schema(self, pdf_path: str):
        content = await CrewAI.extract_text_from_pdf(pdf_path)
        schema_extraction_crew = Crew(
            agents=[self.schema_extraction_agent], tasks=[self.schema_extraction_task]
        )
        schemas = schema_extraction_crew.kickoff(inputs={"content": content})
        return schemas.pydantic.schemas

    async def generate_columns(self, pdf_path: str, schema_name: str, pages: list[int]):
        content = await CrewAI.extract_text_from_pdf(pdf_path, pages)
        columns_extraction_crew = Crew(
            agents=[self.columns_extraction_agent],
            tasks=[self.columns_extraction_task],
        )
        columns = columns_extraction_crew.kickoff(
            inputs={"content": content, "schema_name": schema_name}
        )
        return columns.pydantic.columns

    async def generate_rules(
        self,
        pdf_path: str,
        schema_name: str,
        pages: list[int],
        columns: list[str],
        prompt: str,
    ):
        content = await CrewAI.extract_text_from_pdf(pdf_path, pages)
        rules_extraction_crew = Crew(
            agents=[self.rules_extraction_agent], tasks=[self.rules_extraction_task]
        )
        rules = rules_extraction_crew.kickoff(
            inputs={
                "content": content,
                "schema": schema_name,
                "columns": str(columns),
                "prompt": prompt,
            }
        )
        return rules.pydantic.rules

    async def generate_rule(
        self,
        pdf_path: str,
        schema_name: str,
        pages: list[int],
        columns: list[str],
        rule_category: Literal["record", "batch"],
        rule_description: str,
        rule_columns: list[str],
        prompt: str,
    ):
        content = await CrewAI.extract_text_from_pdf(pdf_path, pages)
        rules_modification_crew = Crew(
            agents=[self.rules_modification_agent], tasks=[self.rules_modification_task]
        )

        rule = rules_modification_crew.kickoff(
            inputs={
                "content": content,
                "schema": schema_name,
                "columns": str(columns),
                "rule": str(
                    {
                        "category": rule_category,
                        "description": rule_description,
                        "columns": rule_columns,
                    }
                ),
                "prompt": prompt,
            }
        )

        return inspect.getsource(rule.pydantic.rule)

    async def generate_code(
        self,
        pdf_path,
        pages,
        schema_name,
        columns,
        rule_description,
        rule_columns,
        rule_category,
        prompt,
    ):
        content = await CrewAI.extract_text_from_pdf(pdf_path, pages)

        code_generation_task = self.record_code_generation_task
        if rule_category == "batch":
            code_generation_task = self.batch_code_generation_task

        code_generation_crew = Crew(
            agents=[self.code_generator_agent],
            tasks=[code_generation_task],
        )

        code = code_generation_crew.kickoff(
            inputs={
                "content": content,
                "schema": schema_name,
                "columns": columns,
                "rule": str(
                    {
                        "category": rule_category,
                        "description": rule_description,
                        "columns": rule_columns,
                    }
                ),
                "prompt": prompt,
            }
        )

        return CrewAI.extract_code(code.raw)

    @staticmethod
    async def extract_text_from_pdf(
        pdf_path: str, pages: list[int] | None = None
    ) -> str:
        from pdfminer.high_level import extract_text
        from pdfminer.pdfpage import PDFPage

        result = ""
        with open(pdf_path, "rb") as f:
            if pages is None:
                for page_num, page in enumerate(PDFPage.get_pages(f), start=1):
                    page_text = extract_text(pdf_path, page_numbers=[page_num - 1])
                    result += f"\n\n### Page {page_num}\n\n" + page_text.strip()
            else:
                for page_num, page in enumerate(PDFPage.get_pages(f), start=1):
                    if page_num in pages:
                        page_text = extract_text(pdf_path, page_numbers=[page_num - 1])
                        result += f"\n\n### Page {page_num}\n\n" + page_text.strip()

        return result


crew_ai = CrewAI()
