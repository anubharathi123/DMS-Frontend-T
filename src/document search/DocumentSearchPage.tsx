// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress
// } from "@mui/material";

// // Define the structure of the document data
// interface Document {
//   id: number;
//   name: string;
//   dateModified: string;
// }

// const DocumentSearchPage: React.FC = () => {
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSearch = async (): Promise<void> => {
//     if (!startDate || !endDate) return;

//     setLoading(true);
//     setError(null);

//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch(
//         `/api/documents?startDate=${startDate}&endDate=${endDate}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch documents");
//       }

//       const data: Document[] = await response.json();
//       setDocuments(data);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ marginTop: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Document Search
//       </Typography>

//       <TextField
//         label="Start Date"
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         fullWidth
//         value={startDate}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//           setStartDate(e.target.value)
//         }
//         sx={{ marginBottom: 2 }}
//       />

//       <TextField
//         label="End Date"
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         fullWidth
//         value={endDate}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//           setEndDate(e.target.value)
//         }
//         sx={{ marginBottom: 2 }}
//       />

//       <Button
//         variant="contained"
//         color="primary"
//         disabled={!startDate || !endDate || loading}
//         onClick={handleSearch}
//         fullWidth
//       >
//         {loading ? <CircularProgress size={24} /> : "Search"}
//       </Button>

//       {/* Error Handling */}
//       {error && (
//         <Typography color="error" sx={{ marginTop: 2 }}>
//           {error}
//         </Typography>
//       )}

//       {/* Displaying the Documents */}
//       {documents.length > 0 && (
//         <TableContainer component={Paper} sx={{ marginTop: 3 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Date Modified</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {documents.map((doc) => (
//                 <TableRow key={doc.id}>
//                   <TableCell>{doc.id}</TableCell>
//                   <TableCell>{doc.name}</TableCell>
//                   <TableCell>{new Date(doc.dateModified).toLocaleDateString()}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* No Documents Found */}
//       {!loading && documents.length === 0 && startDate && endDate && !error && (
//         <Typography sx={{ marginTop: 2 }}>No documents found for the selected dates.</Typography>
//       )}
//     </Container>
//   );
// };

// export default DocumentSearchPage;






// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import { styled } from "@mui/system";

// // Define the structure of the document data
// interface Document {
//   id: number;
//   name: string;
//   dateModified: string;
// }

// const DocumentSearchPage: React.FC = () => {
//   const [startDate, setStartDate] = useState<string>("");
//   const [endDate, setEndDate] = useState<string>("");
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSearch = async (): Promise<void> => {
//     if (!startDate || !endDate) return;

//     setLoading(true);
//     setError(null);

//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch(
//         `/api/documents?startDate=${startDate}&endDate=${endDate}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch documents");
//       }

//       const data: Document[] = await response.json();
//       setDocuments(data);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ marginTop: 4 }}>
//       <Typography
//         variant="h4"
//         gutterBottom
//         sx={{
//           color: "#3f51b5",
//           fontWeight: 600,
//           textAlign: "center",
//           marginBottom: 3,
//         }}
//       >
//         Document Search
//       </Typography>

//       <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
//         <TextField
//           label="Start Date"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           fullWidth
//           value={startDate}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             setStartDate(e.target.value)
//           }
//           sx={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: 1,
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//             },
//           }}
//         />

//         <TextField
//           label="End Date"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           fullWidth
//           value={endDate}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             setEndDate(e.target.value)
//           }
//           sx={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: 1,
//             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//             },
//           }}
//         />
//       </Box>

//       <Button
//         variant="contained"
//         color="primary"
//         disabled={!startDate || !endDate || loading}
//         onClick={handleSearch}
//         fullWidth
//         sx={{
//           marginTop: 2,
//           padding: "12px",
//           fontSize: "16px",
//           fontWeight: "bold",
//           "&:hover": {
//             backgroundColor: "#3f51b5",
//             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//           },
//         }}
//       >
//         {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
//       </Button>

//       {/* Error Handling */}
//       {error && (
//         <Typography
//           color="error"
//           sx={{
//             marginTop: 2,
//             fontSize: "14px",
//             fontWeight: "bold",
//             textAlign: "center",
//           }}
//         >
//           {error}
//         </Typography>
//       )}

//       {/* Displaying the Documents */}
//       {documents.length > 0 && (
//         <TableContainer
//           component={Paper}
//           sx={{
//             marginTop: 3,
//             borderRadius: 2,
//             boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
//                   ID
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
//                   Name
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: "bold", color: "#3f51b5" }}>
//                   Date Modified
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {documents.map((doc) => (
//                 <TableRow key={doc.id}>
//                   <TableCell>{doc.id}</TableCell>
//                   <TableCell>{doc.name}</TableCell>
//                   <TableCell>
//                     {new Date(doc.dateModified).toLocaleDateString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* No Documents Found */}
//       {!loading && documents.length === 0 && startDate && endDate && !error && (
//         <Typography sx={{ marginTop: 2, textAlign: "center" }}>
//           No documents found for the selected dates.
//         </Typography>
//       )}
//     </Container>
//   );
// };

// export default DocumentSearchPage;











import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  Box,
} from "@mui/material";

interface Document {
  id: number;
  name: string;
  dateModified: string;
}

const DocumentSearchPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (): Promise<void> => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `/api/documents?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data: Document[] = await response.json();
      setDocuments(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 600, fontSize: "1.8rem", color: "primary.main" }}>
        Document Search
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={startDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStartDate(e.target.value)
            }
            sx={{ marginBottom: 2 }}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={endDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEndDate(e.target.value)
            }
            sx={{ marginBottom: 2 }}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2, padding: 1.5, fontWeight: 600, textTransform: "none" }}
        disabled={!startDate || !endDate || loading}
        onClick={handleSearch}
        fullWidth
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
      </Button>

      {/* Error Handling */}
      {error && <Typography sx={{ marginTop: 2, color: "error.main", fontWeight: 500 }}>{error}</Typography>}

      {/* Displaying the Documents */}
      {documents.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.id}</TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{new Date(doc.dateModified).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Documents Found */}
      {!loading && documents.length === 0 && startDate && endDate && !error && (
        <Box sx={{ marginTop: 2, fontStyle: "italic" }}>
          <Typography>No documents found for the selected dates.</Typography>
        </Box>
      )}
    </Container>
  );
};

export default DocumentSearchPage;
