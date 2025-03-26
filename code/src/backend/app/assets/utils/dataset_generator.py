import csv

header = [
    "CustomerID", "InternalObligorID", "OriginalInternalObligorID", "ObligorName", "City", "Country", "ZipCodeForeignMailingCode", 
    "IndustryCode", "IndustryCodeType", "InternalRating", "TIN", "StockExchange", "TKR", "CUSIP", "InternalCreditFacilityID", 
    "OriginalInternalCreditFacilityID", "OriginationDate", "MaturityDate", "FacilityType", "OtherFacilityType", "CreditFacilityPurpose", 
    "OtherFacilityPurpose", "CommittedExposure", "UtilizedExposure", "LineReportedOnFRY9C", "LineOfBusiness", "CumulativeChargeoffs", 
    "PastDue", "NonAccrualDate", "ParticipationFlag", "LienPosition", "SecurityType", "InterestRateVariability", "InterestRate", 
    "InterestRateIndex", "InterestRateSpread", "InterestRateCeiling", "InterestRateFloor", "TaxStatus", "GuarantorFlag", 
    "GuarantorInternalID", "GuarantorName", "GuarantorTIN", "GuarantorInternalRiskRating", "EntityInternalID", "EntityName", 
    "EntityInternalRiskRating", "DateFinancials", "DateLastAudit", "NetSalesCurrent", "NetSalesPriorYear", "OperatingIncome", 
    "DepreciationAmortization", "InterestExpense", "NetIncomeCurrent", "NetIncomePriorYear", "CashMarketableSecurities", 
    "AccountsReceivableCurrent", "AccountsReceivablePriorYear", "InventoryCurrent", "InventoryPriorYear", "CurrentAssetsCurrent", 
    "CurrentAssetsPriorYear", "TangibleAssets", "FixedAssets", "TotalAssetsCurrent", "TotalAssetsPriorYear", "AccountsPayableCurrent", 
    "AccountsPayablePriorYear", "ShortTermDebt", "CurrentMaturitiesLongTermDebt", "CurrentLiabilitiesCurrent", 
    "CurrentLiabilitiesPriorYear", "LongTermDebt", "MinorityInterest", "TotalLiabilities", "RetainedEarnings", "CapitalExpenditures", 
    "SpecialPurposeEntityFlag", "LOCOM", "SNCInternalCreditID", "ProbabilityOfDefault", "LGD", "EAD", "RenewalDate", 
    "CreditFacilityCurrency", "CollateralMarketValue", "PrepaymentPenaltyFlag", "EntityIndustryCode", "ParticipationInterest", 
    "LeveragedLoanFlag", "DispositionFlag", "DispositionScheduleShift", "SyndicatedLoanFlag", "TargetHold", "ASC32620", 
    "PCDNoncreditDiscount"
]

cities = ["New York", "Los Angeles", "Chicago", "Houston", "San Francisco"]
zip_codes = ["10001", "90001", "60601", "77001", "94105"]
industry_codes = ["511110", "541330", "424480", "331110", "511210"]
internal_ratings = ["A", "B", "C"]
company_names = ["Acme Corp", "Beta LLC", "Delta Inc", "Epsilon Co", "Zeta Corp"]
stock_exchanges = ["NYSE", "NASDAQ", "NA"]
tickers = ["ACM", "BETA", "DELTA", "EPS", "ZETA"]
cusips = ["123456", "654321", "234567", "345678", "456789"]
entity_ratings = ["A", "B", "C"]

rows = []

for i in range(1, 101):
    # Anomaly conditions:
    # If i is a multiple of 10, use an incorrect date format for OriginationDate.
    orig_date = "2020-01-15" if i % 10 != 0 else "01/15/2020"
    
    # If i is a multiple of 15, include an extra comma in ObligorName.
    obligor_name = company_names[(i - 1) % len(company_names)]
    if i % 15 == 0:
        obligor_name = obligor_name.replace("Corp", "Corp, Inc") if "Corp" in obligor_name else obligor_name + ", Inc"
    
    # If i is a multiple of 20, append an unprintable character to ObligorName.
    if i % 20 == 0:
        obligor_name = obligor_name + "\u0000"
    
    # If i is a multiple of 4, add a dollar sign to NetSalesCurrent.
    net_sales_current_val = 20000000 + (i * 100000)
    net_sales_current = f"${net_sales_current_val}" if i % 4 == 0 else str(net_sales_current_val)
    
    # For every 25th row, set GuarantorFlag to "2" and supply guarantor details.
    if i % 25 == 0:
        guarantor_flag = "2"
        guarantor_internal_id = f"G{i:03d}"
        guarantor_name = "Guarantor " + company_names[(i - 1) % len(company_names)]
        guarantor_tin = "12-3456789"
        guarantor_risk = "B"
    else:
        guarantor_flag = "1"
        guarantor_internal_id = "NA"
        guarantor_name = "NA"
        guarantor_tin = "NA"
        guarantor_risk = "NA"
    
    row = [
        f"CUST{i:03d}",                          # CustomerID
        f"INT{i:03d}",                           # InternalObligorID
        f"INT{i:03d}",                           # OriginalInternalObligorID
        obligor_name,                            # ObligorName
        cities[(i - 1) % len(cities)],           # City
        "US",                                    # Country
        zip_codes[(i - 1) % len(zip_codes)],     # ZipCodeForeignMailingCode
        industry_codes[(i - 1) % len(industry_codes)],  # IndustryCode
        "1",                                     # IndustryCodeType
        internal_ratings[(i - 1) % len(internal_ratings)],  # InternalRating
        "12-3456789" if i % 2 == 1 else "98-7654321",  # TIN
        stock_exchanges[(i - 1) % len(stock_exchanges)],    # StockExchange
        tickers[(i - 1) % len(tickers)],           # TKR
        cusips[(i - 1) % len(cusips)],             # CUSIP
        f"CF{i:03d}",                            # InternalCreditFacilityID
        f"CF{i:03d}",                            # OriginalInternalCreditFacilityID
        orig_date,                               # OriginationDate
        "2025-01-15",                            # MaturityDate
        "7",                                     # FacilityType
        "",                                      # OtherFacilityType
        "11",                                    # CreditFacilityPurpose
        "",                                      # OtherFacilityPurpose
        str(20000000 + i * 100000),              # CommittedExposure
        str(20000000 + i * 100000 - 500000),       # UtilizedExposure
        str((i % 10) + 1),                       # LineReportedOnFRY9C
        "Corporate Banking",                     # LineOfBusiness
        "0",                                     # CumulativeChargeoffs
        "0",                                     # PastDue
        "9999-12-31",                            # NonAccrualDate
        "1" if i % 2 == 1 else "2",               # ParticipationFlag
        str((i % 4) + 1),                        # LienPosition
        str(i % 7),                              # SecurityType
        "1",                                     # InterestRateVariability
        "0.045",                                 # InterestRate
        "NA",                                    # InterestRateIndex
        "NA",                                    # InterestRateSpread
        "NA",                                    # InterestRateCeiling
        "NA",                                    # InterestRateFloor
        "1",                                     # TaxStatus
        guarantor_flag,                          # GuarantorFlag
        guarantor_internal_id,                   # GuarantorInternalID
        guarantor_name,                          # GuarantorName
        guarantor_tin,                           # GuarantorTIN
        guarantor_risk,                          # GuarantorInternalRiskRating
        f"ENT{i:03d}",                           # EntityInternalID
        f"{company_names[(i - 1) % len(company_names)]} Finance",  # EntityName
        entity_ratings[(i - 1) % len(entity_ratings)],  # EntityInternalRiskRating
        "2020-12-31",                            # DateFinancials
        "2021-01-15",                            # DateLastAudit
        net_sales_current,                       # NetSalesCurrent
        str(19000000 + i * 100000),               # NetSalesPriorYear
        str(3000000 + i * 50000),                 # OperatingIncome
        str(500000 + i * 10000),                  # DepreciationAmortization
        str(400000 + i * 10000),                  # InterestExpense
        str(2500000 + i * 50000),                 # NetIncomeCurrent
        str(2400000 + i * 50000),                 # NetIncomePriorYear
        str(1000000 + i * 5000),                  # CashMarketableSecurities
        str(2000000 + i * 5000),                  # AccountsReceivableCurrent
        str(1800000 + i * 5000),                  # AccountsReceivablePriorYear
        str(1500000 + i * 5000),                  # InventoryCurrent
        str(1400000 + i * 5000),                  # InventoryPriorYear
        str(5000000 + i * 20000),                 # CurrentAssetsCurrent
        str(4800000 + i * 20000),                 # CurrentAssetsPriorYear
        str(10000000 + i * 50000),                # TangibleAssets
        str(8000000 + i * 50000),                 # FixedAssets
        str(15000000 + i * 100000),               # TotalAssetsCurrent
        str(14500000 + i * 100000),               # TotalAssetsPriorYear
        str(1200000 + i * 5000),                  # AccountsPayableCurrent
        str(1100000 + i * 5000),                  # AccountsPayablePriorYear
        str(500000 + i * 3000),                   # ShortTermDebt
        str(700000 + i * 3000),                   # CurrentMaturitiesLongTermDebt
        str(3000000 + i * 10000),                 # CurrentLiabilitiesCurrent
        str(2900000 + i * 10000),                 # CurrentLiabilitiesPriorYear
        str(4000000 + i * 15000),                 # LongTermDebt
        "NA",                                   # MinorityInterest
        str(7000000 + i * 20000),                # TotalLiabilities
        str(2000000 + i * 10000),                # RetainedEarnings
        str(600000 + i * 5000),                  # CapitalExpenditures
        "1",                                   # SpecialPurposeEntityFlag
        "3",                                   # LOCOM
        "NA",                                  # SNCInternalCreditID
        "0.0050",                              # ProbabilityOfDefault
        "0.4500",                              # LGD
        str(20000000 + i * 100000),              # EAD
        "9999-12-31",                          # RenewalDate
        "USD",                                 # CreditFacilityCurrency
        str(25000000 + i * 100000),              # CollateralMarketValue
        "3",                                   # PrepaymentPenaltyFlag
        industry_codes[(i - 1) % len(industry_codes)],  # EntityIndustryCode
        "1.0000",                              # ParticipationInterest
        "1",                                   # LeveragedLoanFlag
        "0",                                   # DispositionFlag
        "",                                    # DispositionScheduleShift
        "0",                                   # SyndicatedLoanFlag
        "NA",                                  # TargetHold
        str(20000000 + i * 100000),              # ASC32620
        ""                                     # PCDNoncreditDiscount
    ]
    rows.append(row)

with open("generated_data.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print("CSV file 'generated_data.csv' with 100 rows has been generated.")
