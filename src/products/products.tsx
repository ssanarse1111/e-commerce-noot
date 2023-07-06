import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import ProductDialog from './product-dialog/product-dialog';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../apis/api-service';

export const Products = () => {

    const [allProductsData, setAllProductsData] = useState([
        { id: '', productName: '', description: '', creationDate: '' }
    ])
    const { isLoading, isError, data: productList, error } = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts
    });

    const [editId, setEditId] = useState();


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Id', width: 150 },
        { field: 'productName', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 350 },
        { field: 'creationDate', headerName: 'Date', width: 200 },
    ];

    function onEditData(data: any) {
        setEditId(data.id);
    }

    useEffect(() => {
        if (productList) {
            setAllProductsData(productList);
        }
    }, [productList])

    function onEditId(data: any) {
        setEditId(data);
    }

    return (
        <div className='p-4'>
            <div className='d-flex'>
                <h5>Products</h5>
            </div>
            <ProductDialog allProductsData={allProductsData} editId={editId} onEditId={onEditId} />
            <DataGrid
                rows={allProductsData}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                onRowClick={onEditData}
            />
        </div>
    )
}



// Table Headers - Name, Desc, Date





