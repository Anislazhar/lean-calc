import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  styled,
  tableCellClasses,
} from "@mui/material";
import { SxProps } from "@mui/system";

const tableContainerSx: SxProps = {
  maxWidth: "99vw",
  maxHeight: 400,
  mb: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

interface LoanTableProps {
  amortizationSchedule: Array<any>;
}

const ResultsTable: React.FC<LoanTableProps> = ({ amortizationSchedule }) => {
  return (
    <TableContainer component={Paper} sx={tableContainerSx}>
      <Table stickyHeader aria-label="a dense table" sx={{ width: 700 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell scope="header ">Jahr</StyledTableCell>
            <StyledTableCell>Ratenhöhe</StyledTableCell>
            <StyledTableCell>Zinsanteil</StyledTableCell>
            <StyledTableCell>Tilgungsanteil</StyledTableCell>
            <StyledTableCell>Restschuld</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {amortizationSchedule.map((entry, index) => (
            <TableRow key={index}>
              <StyledTableCell>{entry.year}</StyledTableCell>
              <StyledTableCell>
                {entry.monthlyPayment.toFixed(2)} €
              </StyledTableCell>
              <StyledTableCell>
                {entry.interestPayment.toFixed(2)} €
              </StyledTableCell>
              <StyledTableCell>
                {entry.principalPayment.toFixed(2)} €
              </StyledTableCell>
              <StyledTableCell>{entry.balance.toFixed(2)} €</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;
