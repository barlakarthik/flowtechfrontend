import React, { useState, useContext, useEffect } from 'react';
import useFetch from '../hook/fetch.hook';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { store } from '../App';
import 'font-awesome/css/font-awesome.min.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';

const EnquiryModal = ({ selectedRowData, viewMode, isEdit, editRowData }) => {
    console.log(editRowData, "editRowData");
    const [activeTab, setActiveTab] = useState(0);
    const [productActiveTab, setProductActiveTab] = useState(0);
    const [data, setData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [sNo, setSNo] = useState(1);
    const [enquiryOwner, setEnquiryOwner] = useState('');
    const [sector, setSector] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const [email] = useContext(store);
    const [{ isLoading, apiData, serverError }] = useFetch(`/email/${email}`);


    useEffect(() => {
        if (selectedRowData && selectedRowData.length > 0) {
            setEnquiryOwner({ label: selectedRowData[0].enqOwner });
            setSector({ label: selectedRowData[0].sector });
        }
    }, [selectedRowData]);



    const handleItemSelect = (selected) => {
        const selectedItem = selectedItems.find((item) => item.value === selected.value);

        if (selectedItem) {
            const updatedItems = selectedItems.map((item) => {
                if (item.value === selected.value) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                        totalPrice: (item.quantity + 1) * item.price,
                    };
                }
                return item;
            });
            setSelectedItems(updatedItems);
        } else {
            setSelectedItems([
                ...selectedItems,
                {
                    ...selected,
                    quantity: 1,
                    sNo: sNo,
                    totalPrice: selected.price,
                },
            ]);
            setSNo(sNo + 1);
        }

        setTotalItems(selectedItems.length);
        const newTotalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
        setTotalQuantity(newTotalQuantity);
        const newTotalPrice = selectedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalPrice(newTotalPrice);
    };

    const handleQuantityChange = (item, change) => {
        const updatedItems = selectedItems.map((selectedItem) => {
            if (selectedItem.value === item.value) {
                const newQuantity = selectedItem.quantity + change;
                if (newQuantity < 0) {
                    return selectedItem;
                }
                const newTotalPrice = newQuantity * selectedItem.price;

                return {
                    ...selectedItem,
                    quantity: newQuantity,
                    totalPrice: newTotalPrice,
                };
            }
            return selectedItem;
        });
        setSelectedItems(updatedItems);

        setTotalItems(selectedItems.length);
        const newTotalQuantity = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
        setTotalQuantity(newTotalQuantity);
        const newTotalPrice = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalPrice(newTotalPrice);
    };

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get('http://localhost:8080/api/products')
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        axios.get('http://localhost:8080/api/getusers')
            .then((res => {
            }))
    };

    const productCategories = [
        { key: 'groceries', label: 'Groceries' },
        { key: 'mobiles', label: 'Mobiles' },
        { key: 'footwear', label: 'Footwear' },
        { key: 'deo', label: 'Deo' },
        { key: 'electronics', label: 'Electronics' },
    ];

    const updateFinalTable = () => {
        const selectedProducts = selectedItems.map((item) => {
            const product = data.find((product) => product.name === item.label);
            return {
                itemName: item.label,
                quantity: item.quantity,
                price: item.price,
                countInStock: product ? product.countInStock : 0,
                description: product ? product.description : '',
            };
        });
        const updateData = {
            accountname: apiData?.username,
            contact: apiData?.mobile,
            territory: apiData?.address,
            enqRefNum: apiData?._id,
            enqSource: apiData?.email,
            sector: sector.label,
            stage: document.getElementById('stage')?.value || '',
            enqOwner: enquiryOwner.label,
            products: selectedProducts,
        }
        axios.put(`http://localhost:8080/api/enquiry/${editRowData._id}`, updateData)
            .then((response) => {
                console.log(response);
                toast.success('Enquiry updated successfully');
                // window.location.reload()
            })
            .catch((error) => {
                console.error('Error updatting enquiry:', error);
                if (error.response) {
                    console.log('Response Data:', error.response.data);
                }
            });

    }

    const submitFinalTable = () => {
        const selectedProducts = selectedItems.map((item) => {
            const product = data.find((product) => product.name === item.label);
            return {
                itemName: item.label,
                quantity: item.quantity,
                price: item.price,
                countInStock: product ? product.countInStock : 0,
                description: product ? product.description : '',
            };
        });

        const formData = {
            accountname: apiData?.username,
            contact: apiData?.mobile,
            territory: apiData?.address,
            enqRefNum: apiData?._id,
            enqSource: apiData?.email,
            sector: sector.label,
            stage: document.getElementById('stage')?.value || '',
            enqOwner: enquiryOwner.label,
            products: selectedProducts,
        };

        axios
            .post('http://localhost:8080/api/enquiry', formData)
            .then((response) => {
                toast.success('Enquiry submitted successfully');
                // window.location.reload()
            })
            .catch((error) => {
                console.error('Error submitting enquiry:', error);
                if (error.response) {
                    console.log('Response Data:', error.response.data);
                }
            });
        setSelectedItems([])
        setActiveTab(0)
        setProductActiveTab(0)
        setSNo(1);
    };


    const handleRemoveItem = (itemToRemove) => {
        const updatedItems = selectedItems.filter((item) => item.value !== itemToRemove.value);
        setSelectedItems(updatedItems);
        setTotalItems(updatedItems.length);
        const newTotalQuantity = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
        setTotalQuantity(newTotalQuantity);
        const newTotalPrice = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalPrice(newTotalPrice);
    };

    return (
        <>
            <form>
                <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
                    <TabList>
                        <Tab>Enquiry Form</Tab>
                        <Tab>Products</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="form-group">
                            <label htmlFor="accountName">Account Name</label>
                            <input type="text" id="accountName" className="form-control" placeholder="Enter account name" value={apiData?.username} disabled={viewMode} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactPerson">Contact Person</label>
                            <input type="text" id="contactPerson" className="form-control" placeholder="Enter contact person" value={apiData?.mobile} disabled={viewMode} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input type="text" id="location" className="form-control" placeholder="Enter location" value={apiData?.address} disabled={viewMode} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="enquiryRefNumber">Enquiry Reference Number</label>
                            <input type="text" id="enquiryRefNumber" className="form-control" placeholder="Enter reference number" value={apiData?._id} disabled={viewMode} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="enquirySource">Enquiry Source (Email)</label>
                            <input type="text" id="enquirySource" className="form-control" placeholder="Enter enquiry source" value={apiData?.email} disabled={viewMode} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sector">Sector (Based on type of Customer)</label>
                            <Select
                                id='sector'
                                options={[
                                    { label: 'Large Scale' },
                                    { label: 'Small Scale' }
                                ]}
                                value={sector}
                                onChange={(e) => setSector(e)}
                                isDisabled={viewMode}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stage">Stage (Enquiry stage)</label>
                            <input type="text" id="stage" className="form-control" placeholder="Enter stage" disabled={viewMode} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="enquiryOwner">Enquiry Owner</label>
                            <Select
                                id='enquiryOwner'
                                options={[
                                    { label: 'Harsha' },
                                    { label: 'Karthik' },
                                    { label: 'Mohan' }
                                ]}
                                value={enquiryOwner}
                                onChange={(e) => setEnquiryOwner(e)}
                                isDisabled={viewMode}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <Tabs selectedIndex={productActiveTab} onSelect={(index) => setProductActiveTab(index)}>
                            {!viewMode && (
                                <TabList>
                                    {productCategories.map((category, index) => (
                                        <Tab key={index}>{category.label}</Tab>
                                    ))}
                                </TabList>
                            )}
                            {productCategories.map((category, index) => (
                                <TabPanel key={index}>
                                    <div>
                                        {!viewMode && (
                                            <label htmlFor={`categoryDropdown_${category.key}`}>
                                                Select {category.label}:
                                            </label>
                                        )}
                                        {!viewMode && (
                                            <Select
                                                id={`categoryDropdown_${category.key}`}
                                                options={data
                                                    .filter((product) => product.category === category.key)
                                                    .map((product) => ({
                                                        value: product.name,
                                                        label: product.name,
                                                        price: product.price,
                                                    }))
                                                }
                                                onChange={(selected) => handleItemSelect(selected)}
                                            />
                                        )}
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    {!viewMode && <th>Action</th>}
                                                </tr>
                                            </thead>
                                            {viewMode ? (
                                                <tbody>
                                                    {selectedRowData?.map((item, index) => (
                                                        <React.Fragment key={item._id}>
                                                            {item.products.map((product, productIndex) => (
                                                                <tr key={`${item._id}-${productIndex}`}>
                                                                    <td>{productIndex + 1}</td>
                                                                    <td>{product.itemName}</td>
                                                                    <td>{product.quantity}</td>
                                                                    <td>{product.price}</td>
                                                                    {!viewMode && <td>
                                                                        <i
                                                                            className="fa fa-trash mx-2 col-1"
                                                                            style={{ cursor: "pointer", color: "red" }}
                                                                            onClick={() => handleRemoveItem(item)}
                                                                        ></i>
                                                                    </td>}
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            ) : (
                                                <tbody>
                                                    {console.log(selectedItems, "selectedItems Last")}
                                                    {selectedItems.map((item) => (
                                                        <tr key={item.value}>
                                                            <td>{item.sNo}</td>
                                                            <td>{item.label}</td>
                                                            <td>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleQuantityChange(item, -1);
                                                                    }}
                                                                >
                                                                    -
                                                                </button>
                                                                {item.quantity}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleQuantityChange(item, 1);
                                                                    }}
                                                                >
                                                                    +
                                                                </button>
                                                            </td>
                                                            <td>{item.totalPrice}</td>
                                                            <td>
                                                                <i
                                                                    className="fa fa-trash mx-2 col-1"
                                                                    style={{ cursor: "pointer", color: "red" }}
                                                                    onClick={() => handleRemoveItem(item)}
                                                                ></i>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            )}
                                        </table>
                                    </div>
                                </TabPanel>
                            ))}
                        </Tabs>
                    </TabPanel>
                </Tabs>
            </form>
            <div className="modal-footer">
                {!viewMode && (
                    isEdit ? (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                if (selectedItems.length === 0) {
                                    toast.error('Please select at least one product.');
                                } else {
                                    updateFinalTable();
                                }
                            }}
                        >
                            Update
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                if (selectedItems.length === 0) {
                                    toast.error('Please select at least one product.');
                                } else {
                                    submitFinalTable();
                                }
                            }}
                        >
                            Submit
                        </button>
                    )
                )}
            </div>

        </>
    );
};

export default EnquiryModal;
