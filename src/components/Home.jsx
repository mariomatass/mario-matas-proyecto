import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Paper, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, MenuItem } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Topbar from "./Topbar"
import { Tooltip } from "@mui/material";
import { db } from "../Firebaseconfig";

function Home() {
    const userData = useSelector(state => state.login);
    const navigate = useNavigate();
    const [item, setItem] = useState({
        tipo: '',
        asignatura: '',
        editorial: '',
        curso: '',
        cantidad: 1,
        autor: '',
        nombreLibro: ''
    });
    const [tableData, setTableData] = useState([]);
    const isLoggedin = userData.isAutenticated;

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/');
        } else {
            handleSelectItem();
        }
    }, [isLoggedin, navigate]);

    const handleSaveItem = async (e) => {
        e.preventDefault();
        try {
            await db.collection('items').add(item);
            handleSelectItem();
            setItem({
                tipo: '',
                asignatura: '',
                editorial: '',
                curso: '',
                cantidad: 1,
                autor: '',
                nombreLibro: ''
            });
        } catch (error) {
            console.error('Error al guardar el item:', error);
        }
    };

    const handleSelectItem = async () => {
        try {
            const itemsSnapshot = await db.collection('items').get();
            const itemsData = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTableData(itemsData);
        } catch (error) {
            console.error('Error al obtener los items:', error);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await db.collection('items').doc(id).delete();
            handleSelectItem();
        } catch (error) {
            console.error('Error al borrar el item:', error);
        }
    };

    console.log(userData);

    return (
        <>
            <Topbar />
            <Paper
                elevation={3}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '700px',
                }}
            >
                <Box
                    component="form"
                    autoComplete="off"
                    onSubmit={handleSaveItem}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 2,
                    }}
                >
                    {/* Campos de entrada para el nuevo item */}
                    {/* ... */}

                    {userData.userRol !== 'invitado' && <Tooltip title="Añadir registro" arrow><Button type="submit" variant="contained">Insertar</Button></Tooltip>}
                </Box>
                <TableContainer>
                    <Table aria-label="tabla">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell style={{ color: 'black' }}>Tipo</TableCell>
                                {/* Agrega más encabezados de tabla según tu estructura de datos */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        {userData.userRol === 'admin' &&
                                            <Tooltip title="Borrar" arrow>
                                                <Button onClick={() => handleDeleteItem(row.id)}>
                                                    <DeleteForeverIcon />
                                                </Button>
                                            </Tooltip>}
                                    </TableCell>
                                    <TableCell>{row.tipo}</TableCell>
                                    {/* Renderiza más celdas de acuerdo a tu estructura de datos */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}

export default Home;
