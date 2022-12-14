import React, { useEffect } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { FormControl, Divider } from "@mui/material";
import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import NavBar from "../layouts/NavBar.js";

import {
  BRANCH_API_URL,
  RENTALS_API_URL,
  CUSTOMER_API_URL,
} from "../../constants";

import "../../css/rent.css";

const BranchSelect = () => {
  const [branches, setBranches] = React.useState([]);
  const [branch, setBranch] = React.useState([]);
  const [licensePlate, setLicensePlate] = React.useState("");
  const [customers, setCustomers] = React.useState([]);
  const [person, setPerson] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [transaction, setTransaction] = React.useState([]);
  const [transactionRow, setTransactionRow] = React.useState([]);
  const [nextCheck, setNextChecker] = React.useState(false);
  const [searchCheck, setSearchCheck] = React.useState(true);

  const location = useLocation();
  const { id } = location.state;
  console.log("customer id: " + id);

  useEffect(() => {
    axios.get(BRANCH_API_URL).then((response) => {
      setBranches(response.data);
    });

    axios.get(CUSTOMER_API_URL).then((response) => {
      setCustomers(response.data);
    });

    axios.get(RENTALS_API_URL).then((response) => {
      setTransactions(response.data);
    });
  }, []);

  const handleChange = (event) => {
    getBranch(event.target.value);
  };

  const getBranch = (branchID) => {
    branches.forEach((item) => {
      if (item.branchID === branchID) {
        setBranch(item);
      }
    });
  };
  const handleEntry = (event) => {
    setLicensePlate(event.target.value);
    setSearchCheck(true);
    setNextChecker(false);
  };

  const transactionCol = [
    { field: "customer", headerName: "Customer", width: 150 },
    { field: "startDate", headerName: "Start Date", width: 150 },
    { field: "endDate", headerName: "End Date", width: 150 },
    { field: "returnDate", headerName: "Returned Date", width: 150 },
    { field: "cost", headerName: "Total Cost", width: 150 },
  ];

  const handleTable = () => {
    const testRow = [];

    transactions.map((transaction) => {
      if (transaction.licensePlate == licensePlate) {
        customers.map((customer) => {
          if (customer.customerID == transaction.customerID) {
            // transactions that matches the customer ID
            const entry = {
              id: transaction.rentalID,
              customer: customer.firstName,
              startDate: transaction.dateFrom,
              endDate: transaction.dateTo,
              returnDate: transaction.dateReturned,
              cost: transaction.totalCost,
            };
            testRow.push(entry);
          }
        });
      }
    });

    setTransactionRow(testRow);
  };

  const rowClick = (params) => {
    setNextChecker(true);
    transactions.map((line) => {
      if (line.rentalID == params.row.id) {
        setTransaction(line);
        customers.map((customer) => {
          if (customer.customerID == line.customerID) {
            setPerson(customer);
          }
        });
      }
    });
  };

  return (
    <>
      <NavBar state={{ id: id }} />
      <div>
        <div className="container-avail header">
          <h1>Employee Dashboard</h1>
        </div>
        <div className="container-avail header">
          <h2>Branch Look-Up</h2>
        </div>
        <div className="wrapper header">
          <section className="container-class">
            <Typography>Select your branch:</Typography>
            <Box sx={{ width: "25%" }}>
              <FormControl fullWidth>
                <InputLabel id="branch-select-label">Branch</InputLabel>
                <Select
                  labelId="branch-select-label"
                  id="branch-select"
                  value={branch.branchID}
                  label="Branch"
                  onChange={handleChange}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.branchID} value={branch.branchID}>
                      {branch.unitNumber}-{branch.streetNumber}{" "}
                      {branch.streetName}, {branch.city} {branch.province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </section>

          <div className="container-buttons">
            <div className="backb">
              <Button
                variant="contained"
                component={Link}
                to={{ pathname: "/AddBranch" }}
                state={{
                  branch: branch,
                  id: id,
                }}
              >
                Add New Branch
              </Button>
            </div>

            <div className="nextb">
              <Button
                variant="contained"
                disabled={branch.branchID === undefined}
                component={Link}
                to={{ pathname: "/BranchInfo" }}
                state={{
                  branch: branch,
                  id: id,
                }}
              >
                Go To Branch
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Divider sx={{ mt: 5 }} />
        </div>
        <div className="container-avail header">
          <h2>Transaction Look-Up</h2>
        </div>
        <div className="license-search">
          <Typography>License plate number:</Typography>
          <div>
            <div className="search">
              <TextField id="outlined-required" onChange={handleEntry} />
              <Button
                className="search button"
                variant="contained"
                disabled={searchCheck === false}
                onClick={handleTable}
              >
                search
              </Button>
            </div>
          </div>

          <div style={{ height: 400, width: "auto" }}>
            <DataGrid
              rows={transactionRow}
              columns={transactionCol}
              onRowClick={rowClick}
            />
          </div>
          <div style={{padding:'10px'}}>
          <Button
            className="next-button"
            variant="contained"
            disabled={nextCheck === false}
            component={Link}
            to={{ pathname: "/ReturnDetails" }}
            state={{
              transaction: transaction,
              person: person,
              branches: branches,
              id: id,
            }}
          >
            Next
          </Button>
          </div>
          
        </div>
      </div>
    </>
  );
};
export default BranchSelect;
