"use client";
import React, { useState, useEffect } from "react";
import LoanInput from "../types/LoanInput";
import LoanResult from "../types/LoanResult";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ResultsTable from "./ResultsTable";

const LoanCalculator: React.FC = () => {
  const [input, setInput] = useState<LoanInput>({
    loanAmount: "220000",
    interestRate: "2",
    initialRepayment: "10",
    years: "10",
  });

  const [result, setResult] = useState<LoanResult | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const calculateLoan = () => {
      const interestRate = parseFloat(input.interestRate) / 100;
      const initialRepayment =
        (parseFloat(input.initialRepayment) / 100) *
        parseFloat(input.loanAmount);
      const loanAmountAfterRepayment =
        parseFloat(input.loanAmount) - initialRepayment;
      const years = parseInt(input.years);
      const months = years * 12;

      if (
        isNaN(interestRate) ||
        isNaN(initialRepayment) ||
        isNaN(loanAmountAfterRepayment) ||
        isNaN(years) ||
        isNaN(months)
      ) {
        setResult(null);
        return;
      }

      const monthlyInterestRate = interestRate / 12;

      const monthlyPayment =
        (loanAmountAfterRepayment * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -months));

      const amortizationSchedule = [];
      let balance = loanAmountAfterRepayment;

      for (let year = 1; year <= years; year++) {
        for (let month = 1; month <= 12; month++) {
          const monthlyInterestPayment = balance * monthlyInterestRate;
          const monthlyPrincipalPayment =
            monthlyPayment - monthlyInterestPayment;
          balance -= monthlyPrincipalPayment;

          amortizationSchedule.push({
            year,
            month,
            monthlyPayment,
            interestPayment: monthlyInterestPayment,
            principalPayment: monthlyPrincipalPayment,
            balance,
          });
        }
      }

      setResult({
        monthlyPayment,
        finalBalance: balance,
        amortizationSchedule,
      });
    };

    if (isCalculated) {
      calculateLoan();
    }
  }, [isCalculated, input]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setInput({ ...input, [field]: event.target.value });
  };

  const handleCalculateClick = () => {
    setIsCalculated(true);
  };

  const handleYearsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setInput({ ...input, years: event.target.value as string });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: "secondary.main" }}>
          <PointOfSaleIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Tilgungsrechner
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                variant="standard"
                color="secondary"
                label="Darlehensbetrag (€)"
                fullWidth
                value={input.loanAmount}
                onChange={(e) => handleInputChange(e, "loanAmount")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Sollzinssatz (%)"
                variant="standard"
                color="secondary"
                fullWidth
                value={input.interestRate}
                onChange={(e) => handleInputChange(e, "interestRate")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Anfängliche Tilgung (%)"
                color="secondary"
                variant="standard"
                fullWidth
                value={input.initialRepayment}
                onChange={(e) => handleInputChange(e, "initialRepayment")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              mb={-1}
              display="flex"
              alignItems="end"
              justifyContent="space-evenly"
            >
              <InputLabel id="input_years">
                Zinsbindungsdauer (Jahre):
              </InputLabel>
              <select
                aria-label="select_years"
                value={input.years}
                onChange={handleYearsChange}
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Button
            color="secondary"
            fullWidth
            variant="contained"
            onClick={handleCalculateClick}
            sx={{ mt: 4, mb: 2 }}
          >
            Berechnen
          </Button>
        </Box>
        <Box>
          {result && (
            <Box>
              <Typography component="h2" align="center" variant="h5" mb={2}>
                Ergebnisse:
              </Typography>
              <Typography align="center">
                Monatliche Rate: {result.monthlyPayment.toFixed(2)} €
              </Typography>
              <Typography align="center">
                Restschuld am Ende der Zinsbindung:
                {result.amortizationSchedule[
                  result.amortizationSchedule.length - 2
                ].balance.toFixed(2)}
                €
              </Typography>
              <Typography variant="h5" align="center" py={2}>
                Tilgungsplan:
              </Typography>
              <ResultsTable
                amortizationSchedule={result.amortizationSchedule}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoanCalculator;
