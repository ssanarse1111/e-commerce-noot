import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { InputLabel, TextField, FormControl, Select, MenuItem, Stack, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createProduct, deleteProduct, getAllAttributes, getAllCategories, getProduct, updateProduct } from '../../apis/api-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function ProductDialog(props: any) {
    const { isLoading, isError, data: product, error } = useQuery({
        queryKey: ["products", props.editId === undefined ? '' : props.editId],
        queryFn: () => getProduct(props.editId === undefined ? '' : props.editId)
    });

    const [varaintObj, setvaraintObj] = useState({
        attributes: { attributeId: '', attributeName: '', listItems: '' },
        price: 0,
        discount: 0,
        quantity: 0
    })

    const queryClient = useQueryClient();

    const [allCategories, setAllCategories] = useState([]);
    const [allAttributes, setAllAttributes] = useState([]);
    const [variantArr, setVariantArr] = useState([]);
    const [attrArray, setAttrArray] = useState([]);
    const [productObj, setProductObj] = useState({
        productName: "",
        description: "",
        categoryName: "",
        variants: []
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    const { data: attributes } = useQuery({
        queryKey: ["attributes"],
        queryFn: getAllAttributes,
    });

    useEffect(() => {
        if (categories) {
            setAllCategories(categories);
        }
    }, [categories])

    useEffect(() => {
        if (attributes) {
            setAllAttributes(attributes);
        }
    }, [attributes])

    useEffect(() => {
        if (props.editId) {
            setOpenParent(true);
        };
    }, [props.editId])

    useEffect(() => {
        if (product) {
            setProductObj(product);
        };
    }, [product])

    const createProductMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });

    const updateProductMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });

    const deleteProductMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });

    const [openParent, setOpenParent] = useState(false);
    const [openChild, setOpenChild] = useState(false);
    const handleOpenParent = () => {
        setOpenParent(true);
    };
    const handleCloseParent = () => {
        setOpenParent(false);
        setProductObj({
            productName: "",
            description: "",
            categoryName: "",
            variants: []
        });
    };

    function onNewProduct() {
        handleOpenParent();
        props.onEditId(undefined);
    }

    const handleOpenChild = () => {
        setOpenChild(true);
    };
    const handleCloseChild = () => {
        setOpenChild(false);
        setvaraintObj({
            attributes: { attributeId: '', attributeName: '', listItems: '' },
            price: 0,
            discount: 0,
            quantity: 0
        });
    };

    function onCancel() {
        setOpenParent(false);
    }

    function createProductFn(event: any) {
        event.preventDefault();
        if (props.editId) {
            updateProductMutation.mutate({
                id: product.id,
                creationDate: product.creationTime,
                ...productObj
            });
        } else {
            createProductMutation.mutate({
                id: uuidv4(),
                creationDate: new Date(),
                ...productObj
            });
        };
        setProductObj({
            productName: "",
            description: "",
            categoryName: "",
            variants: []
        });
        handleCloseParent();
    }

    function onEditUpdate(e: any) {
        e.preventDefault();
        updateProductMutation.mutate({
            id: product.id,
            creationDate: product.creationTime,
            ...productObj
        });
    }

    function onAddAttribute(e: any) {
        e.preventDefault();
        const data: any = [...attrArray, varaintObj.attributes]
        setAttrArray(data);
    }

    function onAttributeDelete(index: number) {
        const data = attrArray.filter((x: any, i: number) => i !== index);
        setAttrArray(data);
    }

    useEffect(() => {
        const data: any = { ...varaintObj, attributes: attrArray };
        setvaraintObj(data);
    }, [attrArray])


    function onVariantSave(e: any) {
        e.preventDefault();
        const data: any = [...variantArr, varaintObj];
        setVariantArr(data);
        setvaraintObj({
            attributes: { attributeId: '', attributeName: '', listItems: '' },
            price: 0,
            discount: 0,
            quantity: 0
        });
        handleCloseChild();
    }

    function onVariantDelete(index: number) {
        const data = variantArr.filter((x: any, i: number) => i !== index);
        setAttrArray(data);
    }

    useEffect(() => {
        const data = { ...productObj, variants: variantArr }
        setProductObj(data)
    }, [variantArr]);

    function deleteProductFn() {
        deleteProductMutation.mutate(props.editId);
        handleCloseParent();
    }


    return (
        <div>
            <div className='my-4'>
                <Button variant="outlined" color="success" startIcon={<AddIcon />} onClick={onNewProduct}>
                    Product
                </Button>
            </div>
            <div className='text-muted my-2'>
                <small>Click on the table row to edit the data</small>
            </div>
            <Modal
                open={openParent}
                onClose={handleCloseParent}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 500 }}>
                    <form onSubmit={createProductFn}>
                        <div className='d-flex align-items-center'>
                            <h5 id="parent-modal-title" className='me-auto'>Create New Product</h5>
                            {props.editId && <DeleteIcon color='error' onClick={deleteProductFn} />}
                        </div>
                        <div className='my-3'>
                            <InputLabel id="Category">Product Title</InputLabel>
                            <div className='d-flex align-items-center'>
                                <TextField size="small" fullWidth id="outlined-basic" variant="outlined" value={productObj.productName}
                                    onChange={(e: any) => setProductObj({ ...productObj, productName: e.target.value })} />
                                {props.editId && (
                                    <div className='text-center ps-2'>
                                        <Button variant="contained" size='small' onClick={onEditUpdate} color='success' >Save</Button>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className='my-3'>
                            <InputLabel id="Category">Description</InputLabel>
                            <div className='d-flex align-items-center'>
                                <TextField fullWidth id="outlined-basic" variant="outlined" value={productObj.description}
                                    onChange={(e: any) => setProductObj({ ...productObj, description: e.target.value })} />
                                {props.editId && (
                                    <div className='text-center ps-2'>
                                        <Button variant="contained" size='small' onClick={onEditUpdate} color='success' >Save</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='my-3'>
                            <InputLabel id="Category">Category</InputLabel>
                            <div className='d-flex align-items-center'>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="Category"
                                        id="Category"
                                        value={productObj.categoryName}
                                        size="small"
                                        onChange={(e: any) => setProductObj({ ...productObj, categoryName: e.target.value })}
                                    >
                                        {allCategories && (
                                            allCategories.map((category: any) => (
                                                <MenuItem value={category.categoryName}>{category.categoryName}</MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                                {props.editId && (
                                    <div className='text-center ps-2'>
                                        <Button variant="contained" size='small' onClick={onEditUpdate} color='success' >Save</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='d-flex mt-3'>
                            <h5 className='me-auto'>Variant</h5>
                            <Button variant="contained" color='success' onClick={handleOpenChild}>Add Variant</Button>
                        </div>
                        <Stack direction="row" spacing={1}>
                            {productObj.variants && productObj.variants.map((variant: any, variantIndex: number) => (
                                <Chip
                                    label={variant.price}
                                    onDelete={() => onVariantDelete(variantIndex)}
                                />
                            ))}
                        </Stack>

                        <div className='mt-5 text-center'>
                            {!props.editId ? (
                                <Button variant="contained" color='success' type='submit' >Create Product</Button>
                            ) :
                                <Button variant="contained" onClick={() => handleCloseParent()} color='error' >Cancel</Button>
                            }

                        </div>

                        <React.Fragment>
                            <Modal
                                open={openChild}
                                onClose={handleCloseChild}
                                aria-labelledby="child-modal-title"
                                aria-describedby="child-modal-description"
                            >
                                <Box sx={{ ...style, width: 500 }}>
                                    <h5 id="child-modal-title">Create Variant</h5>
                                    <p id="child-modal-description">
                                        <div className='my-3'>
                                            <FormControl sx={{ m: 1 }}>
                                                <Select
                                                    labelId="colorSize"
                                                    id="colorSize"
                                                    value={varaintObj.attributes.attributeName}
                                                    size="small"

                                                    onChange={(e: any) => setvaraintObj(
                                                        {
                                                            ...varaintObj, attributes:
                                                                { ...varaintObj.attributes, attributeName: e.target.value, attributeId: e.target.id }
                                                        })}
                                                >
                                                    {
                                                        allAttributes && allAttributes.map((attr: any) => (
                                                            <MenuItem value={attr.attributeName}>{attr.attributeName}</MenuItem>
                                                        ))
                                                    }

                                                </Select>
                                            </FormControl>
                                            <TextField sx={{ m: 1 }} size="small" id="outlined-basic" variant="outlined"
                                                onChange={(e: any) => setvaraintObj({ ...varaintObj, attributes: { ...varaintObj.attributes, listItems: e.target.value } })} />
                                            <Button sx={{ m: 1 }} variant='contained' color="success" onClick={onAddAttribute}>
                                                <AddIcon />
                                            </Button>

                                            <Stack direction="row" spacing={1}>
                                                {attrArray && attrArray.map((x: any, attrArrayIndex: number) => (
                                                    <Chip
                                                        label={`${x.attributeName} - ${x.listItems}`}
                                                        onDelete={() => onAttributeDelete(attrArrayIndex)}
                                                    />
                                                ))}
                                            </Stack>
                                        </div>
                                        <div className='my-3'>
                                            <InputLabel id="Category">Price</InputLabel>
                                            <TextField size="small" type='number' fullWidth id="outlined-basic" variant="outlined"
                                                onChange={(e: any) => setvaraintObj({ ...varaintObj, price: e.target.value })} />
                                        </div>
                                        <div className='my-3'>
                                            <InputLabel id="Category">Discount</InputLabel>
                                            <TextField size="small" type='number' fullWidth id="outlined-basic" variant="outlined"
                                                onChange={(e: any) => setvaraintObj({ ...varaintObj, discount: e.target.value })} />
                                        </div>
                                        <div className='my-3'>
                                            <InputLabel id="Category">Quantity</InputLabel>
                                            <TextField size="small" type='number' fullWidth id="outlined-basic" variant="outlined"
                                                onChange={(e: any) => setvaraintObj({ ...varaintObj, quantity: e.target.value })} />
                                        </div>
                                    </p>
                                    <Button variant="contained" onClick={() => handleCloseChild()} color='error' >Cancel</Button>
                                    <Button variant='contained' color="success" onClick={onVariantSave}>Save</Button>
                                </Box>
                            </Modal>
                        </React.Fragment>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}