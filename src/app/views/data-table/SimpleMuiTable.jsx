import { Box, styled } from "@mui/material";
import { Breadcrumb } from "app/components";
import Axios from "axios";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const SimpleMuiTable = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    Axios.get("/api/user/all").then(({ data }) => {
      if (isAlive) setUserList(data);
    });

    return () => setIsAlive(false);
  }, [isAlive]);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Data Table", path: "/pages" }, { name: "Simple Mui Table" }]}
        />
      </Box>

      <MUIDataTable
        data={userList}
        columns={columns}
        title={"User Report"}
        options={{
          responsive: "simple",
          selectableRows: "none", // set checkbox for each row
          filterType: "textField",
          // search: false, // set search option
          // filter: false, // set data filter option
          // download: false, // set download option
          // print: false, // set print option
          // pagination: true, //set pagination option
          // viewColumns: false, // set column option
          elevation: 0,
          rowsPerPageOptions: [10, 20, 40, 80, 100],
        }}
      />
    </Container>
  );
};

const columns = [
  {
    name: "name", // field name in the row object
    label: "Name", // column title that will be shown in table
    options: { filter: true },
  },
  {
    name: "email",
    label: "Email",
    options: { filter: true },
  },
  {
    name: "company",
    label: "Company",
    options: { filter: true },
  },
  {
    name: "balance",
    label: "Balance",
    options: { filter: true },
  },
];

export default SimpleMuiTable;
