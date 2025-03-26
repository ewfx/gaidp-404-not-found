from app.services.rules import RulesService
from app.services.csv import CsvService
from typing import List, Callable, Dict
import pandas as pd
import io
import zipfile


class RecordRuleExecutor:
    def __init__(self, rule_functions: Dict[str, Callable[[pd.Series], bool]]):
        """
        Initialize with a dictionary of rule functions.
        :param rule_functions: Dictionary where keys are function names and values are functions taking a Series (DataFrame row) and returning a boolean.
        """
        self.rule_functions = rule_functions

    def execute(self, df: pd.DataFrame) -> Dict[str, List[bool]]:
        """
        Execute all rule functions on each row of the DataFrame.
        :param df: Input DataFrame
        :return: A dictionary where keys are function names and values are lists of boolean results for each row
        """
        results = {}
        for name, func in self.rule_functions.items():
            results[name] = []
            for _, row in df.iterrows():
                try:
                    results[name].append(func(row))
                except Exception as e:
                    print(f"Error executing rule '{name}': {e}")
                    results[name].append(False)  # Default to False on error
        return results


class BatchRuleExecutor:
    def __init__(self, rule_functions: Dict[str, Callable[[pd.Series], bool]]):
        """
        Initialize with a dictionary of rule functions.
        :param rule_functions: Dictionary where keys are function names and values are functions taking a Series (DataFrame row) and returning a boolean.
        """
        self.rule_functions = rule_functions

    def execute(self, df: pd.DataFrame) -> Dict[str, List[bool]]:
        """
        Execute all rule functions on each row of the DataFrame.
        :param df: Input DataFrame
        :return: A dictionary where keys are function names and values are lists of boolean results for each row
        """
        results = {}
        for name, func in self.rule_functions.items():
            try:
                results[name] = func(df)
            except Exception as e:
                print(f"Error executing rule '{name}': {e}")
                results[name] = False  # Default to False on error
        return results


def create_record_rule_executor(code_strings: List[str]) -> RecordRuleExecutor:
    """
    Compiles Python code strings into executable functions and returns a RuleExecutor instance.
    :param code_strings: List of Python code strings defining functions
    :return: RuleExecutor instance with compiled rule functions
    """
    rule_functions = {}
    for code in code_strings:
        local_scope = {}
        exec("import pandas as pd\n" + code, {}, local_scope)
        functions = [(name, obj) for name, obj in local_scope.items() if callable(obj)]
        if len(functions) > 0:
            func_name, func = functions[0]
            rule_functions[func_name] = func
    return RecordRuleExecutor(rule_functions)


def create_batch_rule_executor(code_strings: List[str]) -> BatchRuleExecutor:
    """
    Compiles Python code strings into executable functions and returns a RuleExecutor instance.
    :param code_strings: List of Python code strings defining functions
    :return: RuleExecutor instance with compiled rule functions
    """
    rule_functions = {}
    for code in code_strings:
        local_scope = {}
        exec("import pandas as pd\n" + code, {}, local_scope)
        functions = [(name, obj) for name, obj in local_scope.items() if callable(obj)]
        if len(functions) > 0:
            func_name, func = functions[0]
            rule_functions[func_name] = func
    return BatchRuleExecutor(rule_functions)


class ValidationService:
    @staticmethod
    async def get_validator(schema_id: str):
        rules = await RulesService.get_rules(schema_id)
        record_codes = [rule["code"] for rule in rules if rule["category"] == "record"]
        batch_codes = [rule["code"] for rule in rules if rule["category"] == "batch"]
        result = (
            """\
class RecordRuleExecutor:
    def __init__(self, rule_functions: Dict[str, Callable[[pd.Series], bool]]):
        \"\"\"
        Initialize with a dictionary of rule functions.
        :param rule_functions: Dictionary where keys are function names and values are functions taking a Series (DataFrame row) and returning a boolean.
        \"\"\"
        self.rule_functions = rule_functions

    def execute(self, df: pd.DataFrame) -> Dict[str, List[bool]]:
        \"\"\"
        Execute all rule functions on each row of the DataFrame.
        :param df: Input DataFrame
        :return: A dictionary where keys are function names and values are lists of boolean results for each row
        \"\"\"
        results = {}
        for name, func in self.rule_functions.items():
            results[name] = []
            for _, row in df.iterrows():
                try:
                    results[name].append(func(row))
                except Exception as e:
                    print(f"Error executing rule '{name}': {e}")
                    results[name].append(False)  # Default to False on error
        return results


class BatchRuleExecutor:
    def __init__(self, rule_functions: Dict[str, Callable[[pd.Series], bool]]):
        \"\"\"
        Initialize with a dictionary of rule functions.
        :param rule_functions: Dictionary where keys are function names and values are functions taking a Series (DataFrame row) and returning a boolean.
        \"\"\"
        self.rule_functions = rule_functions

    def execute(self, df: pd.DataFrame) -> Dict[str, List[bool]]:
        \"\"\"
        Execute all rule functions on each row of the DataFrame.
        :param df: Input DataFrame
        :return: A dictionary where keys are function names and values are lists of boolean results for each row
        \"\"\"
        results = {}
        for name, func in self.rule_functions.items():
            try:
                results[name] = func(df)
            except Exception as e:
                print(f"Error executing rule '{name}': {e}")
                results[name] = False  # Default to False on error
        return results


def create_record_rule_executor(code_strings: List[str]) -> RecordRuleExecutor:
    \"\"\"
    Compiles Python code strings into executable functions and returns a RuleExecutor instance.
    :param code_strings: List of Python code strings defining functions
    :return: RuleExecutor instance with compiled rule functions
    \"\"\"
    rule_functions = {}
    for code in code_strings:
        local_scope = {}
        exec("import pandas as pd\n" + code, {}, local_scope)
        functions = [(name, obj) for name, obj in local_scope.items() if callable(obj)]
        if len(functions) > 0:
            func_name, func = functions[0]
            rule_functions[func_name] = func
    return RecordRuleExecutor(rule_functions)


def create_batch_rule_executor(code_strings: List[str]) -> BatchRuleExecutor:
    \"\"\"
    Compiles Python code strings into executable functions and returns a RuleExecutor instance.
    :param code_strings: List of Python code strings defining functions
    :return: RuleExecutor instance with compiled rule functions
    \"\"\"
    rule_functions = {}
    for code in code_strings:
        local_scope = {}
        exec("import pandas as pd\n" + code, {}, local_scope)
        functions = [(name, obj) for name, obj in local_scope.items() if callable(obj)]
        if len(functions) > 0:
            func_name, func = functions[0]
            rule_functions[func_name] = func
    return BatchRuleExecutor(rule_functions)

record_codes = """
            + str(record_codes)
            + """
batch_codes = """
            + str(batch_codes)
            + """

record_rule_executor = create_record_rule_executor(record_codes)
batch_rule_executor = create_batch_rule_executor(batch_codes)

df = pd.read_csv("filepath")

record_results = record_rule_executor.execute(df)
batch_results = batch_rule_executor.execute(df)

results = {"record": record_results, "batch": batch_results}

print(results)
"""
        )
        return result

    @staticmethod
    async def perform_validation(schema_id: str, csv_id: str):

        rules = await RulesService.get_rules(schema_id)
        csv = await CsvService.get_csv(csv_id)

        record_codes = [rule["code"] for rule in rules if rule["category"] == "record"]
        batch_codes = [rule["code"] for rule in rules if rule["category"] == "batch"]

        record_rule_executor = create_record_rule_executor(record_codes)
        batch_rule_executor = create_batch_rule_executor(batch_codes)

        df = pd.read_csv(csv["filepath"])

        record_results = record_rule_executor.execute(df)
        batch_results = batch_rule_executor.execute(df)

        record_df = pd.DataFrame.from_dict(record_results)
        batch_df = pd.DataFrame.from_dict(batch_results)

        batch_csv = io.StringIO()
        record_csv = io.StringIO()
        batch_df.to_csv(batch_csv, index=False)
        record_df.to_csv(record_csv, index=False)

        # Create a ZIP file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("batch.csv", batch_csv.getvalue())
            zf.writestr("record.csv", record_csv.getvalue())

        zip_buffer.seek(0)

        return zip_buffer
