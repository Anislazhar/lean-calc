interface LoanResult {
  monthlyPayment: number;
  finalBalance: number;
  amortizationSchedule: Array<{
    year: number;
    monthlyPayment: number;
    interestPayment: number;
    principalPayment: number;
    balance: number;
  }>;
}
export default LoanResult;
