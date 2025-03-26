import pandas as pd
import random
from datetime import datetime, timedelta

# Define valid options for the fields
identifier_types = ["CUSIP", "ISIN", "Ticker", "LEI"]
accounting_intents = ["AFS", "HTM", "EQ"]
hedge_types = [1, 2]
hedged_risks = list(range(1, 12))
hedge_interest_rates = [1, 2, 3, 4, 5]
hedged_cash_flows = [1, 2, 3, 4, 5, 6]
sidedness_options = [1, 2]
asu_designations = [1, 2, 3]

# Function to generate a random valid date (yyyy-mm-dd) between 2020 and 2030
def random_date():
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2030, 12, 31)
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    date = start_date + timedelta(days=random_days)
    return date.strftime("%Y-%m-%d")

rows = []
# We will store generated rows in a list of dictionaries.
for i in range(100):
    row = {}
    
    # Identifier Type: valid with 85% chance; anomaly (empty or non-string) with 15% chance.
    if random.random() < 0.85:
        row["Identifier Type"] = random.choice(identifier_types)
    else:
        row["Identifier Type"] = "" if random.random() < 0.5 else 123
    
    # Identifier Value: normally "ID{i}" (ensuring uniqueness) with 85% chance;
    # anomaly: duplicate a previous value or None.
    if random.random() < 0.85:
        row["Identifier Value"] = f"ID{i}"
    else:
        row["Identifier Value"] = f"ID{random.randint(0, i)}" if i > 0 else None
    
    # Market Value (USD Equivalent): valid integer between 10,000 and 1,000,000 most of the time;
    # anomaly: sometimes negative or a non-numeric string.
    if random.random() < 0.9:
        market_value = random.randint(10000, 1000000)
    else:
        market_value = -random.randint(10000, 1000000) if random.random() < 0.5 else "invalid"
    row["Market Value (USD Equivalent)"] = market_value
    
    # Hedge Percentage: valid decimal (0 to 1, up to 4 decimals) with 85% chance;
    # anomaly: value greater than 1, negative, or with extra decimals.
    if random.random() < 0.85:
        hp = round(random.uniform(0, 1), 4)
    else:
        anomaly_type = random.choice(["gt", "neg", "many_decimals"])
        if anomaly_type == "gt":
            hp = round(random.uniform(1.1, 2), 5)
        elif anomaly_type == "neg":
            hp = round(random.uniform(-1, -0.1), 4)
        else:
            hp = random.uniform(0, 1)  # Not rounding properly
    row["Hedge Percentage"] = hp
    
    # Amortized Cost (USD Equivalent):
    # For a valid row, if hp is 1 then equals market value, otherwise equals market_value * hp.
    # With a small chance we introduce an anomaly by offsetting the expected value.
    if isinstance(market_value, int) and isinstance(hp, float) and 0 <= hp <= 1:
        if random.random() < 0.9:  # valid calculation 90% of the time
            if abs(hp - 1.0) < 1e-6:
                amortized_cost = market_value
            else:
                amortized_cost = round(market_value * hp)
        else:
            amortized_cost = round(market_value * hp) + random.randint(1, 1000)
    else:
        amortized_cost = "invalid"
    row["Amortized Cost (USD Equivalent)"] = amortized_cost
    
    # Accounting Intent (AFS, HTM, EQ): valid from the list with 90% chance;
    # anomaly: sometimes an invalid string.
    if random.random() < 0.9:
        row["Accounting Intent (AFS, HTM, EQ)"] = random.choice(accounting_intents)
    else:
        row["Accounting Intent (AFS, HTM, EQ)"] = "XYZ"
    
    # Type of Hedge(s): valid (1 or 2) with 90% chance; anomaly: a value like 3 or text.
    if random.random() < 0.9:
        row["Type of Hedge(s)"] = random.choice(hedge_types)
    else:
        row["Type of Hedge(s)"] = random.choice([3, "Hedge"])
    
    # Hedged Risk: valid integer from 1 to 11 with 90% chance; anomaly: sometimes 0 or 12.
    if random.random() < 0.9:
        row["Hedged Risk"] = random.choice(hedged_risks)
    else:
        row["Hedged Risk"] = random.choice([0, 12])
    
    # Hedge Interest Rate: valid integer from 1 to 5 with 90% chance; anomaly: 6 or missing.
    if random.random() < 0.9:
        row["Hedge Interest Rate"] = random.choice(hedge_interest_rates)
    else:
        row["Hedge Interest Rate"] = random.choice([6, None])
    
    # Hedge Horizon: valid date string most of the time; anomaly: an invalid date.
    if random.random() < 0.9:
        row["Hedge Horizon"] = random_date()
    else:
        row["Hedge Horizon"] = "2020-13-01"  # Invalid month
    
    # Hedged Cash Flow: valid integer from 1 to 6 with 90% chance; anomaly: 0 or 7.
    if random.random() < 0.9:
        row["Hedged Cash Flow"] = random.choice(hedged_cash_flows)
    else:
        row["Hedged Cash Flow"] = random.choice([0, 7])
    
    # Sidedness: valid (1 or 2) with 90% chance; anomaly: non-numeric or empty string.
    if random.random() < 0.9:
        row["Sidedness"] = random.choice(sidedness_options)
    else:
        row["Sidedness"] = random.choice(["One", ""])
    
    # Hedging Instrument at Fair Value: valid integer most of the time; anomaly: sometimes a float.
    if random.random() < 0.9:
        row["Hedging Instrument at Fair Value"] = random.randint(-100000, 1000000)
    else:
        row["Hedging Instrument at Fair Value"] = round(random.uniform(-100000, 1000000), 2)
    
    # Effective Portion of Cumulative Gains and Losses: valid integer; anomaly: sometimes a float.
    if random.random() < 0.9:
        row["Effective Portion of Cumulative Gains and Losses"] = random.randint(-50000, 50000)
    else:
        row["Effective Portion of Cumulative Gains and Losses"] = round(random.uniform(-50000, 50000), 2)
    
    # ASU 2017-12 Hedge Designations: valid integer (1 to 3) with 90% chance; anomaly: sometimes 4.
    if random.random() < 0.9:
        row["ASU 2017-12 Hedge Designations"] = random.choice(asu_designations)
    else:
        row["ASU 2017-12 Hedge Designations"] = 4
    
    rows.append(row)

# Create a DataFrame with the specified column order.
df = pd.DataFrame(rows, columns=[
    "Identifier Type",
    "Identifier Value",
    "Amortized Cost (USD Equivalent)",
    "Market Value (USD Equivalent)",
    "Accounting Intent (AFS, HTM, EQ)",
    "Type of Hedge(s)",
    "Hedged Risk",
    "Hedge Interest Rate",
    "Hedge Percentage",
    "Hedge Horizon",
    "Hedged Cash Flow",
    "Sidedness",
    "Hedging Instrument at Fair Value",
    "Effective Portion of Cumulative Gains and Losses",
    "ASU 2017-12 Hedge Designations"
])

# Save the DataFrame to a CSV file.
df.to_csv("dummy_dataset.csv", index=False)
print("CSV file 'dummy_dataset.csv' created with 100 rows.")
