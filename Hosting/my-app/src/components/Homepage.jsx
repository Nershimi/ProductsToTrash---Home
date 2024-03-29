import { useEffect, useState } from "react";
import TableOfProducts from "./TableOfProducts";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [aboutToExpiredProducts, setAboutToExpiredProducts] = useState([]);
  const [selectedExpiredProducts, setSelectedExpiredProducts] = useState([]);
  const [selectedAboutToExpireProducts, setSelectedAboutToExpireProducts] =
    useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://us-central1-products-to-trash.cloudfunctions.net/getExpiredProducts"
    )
      .then((response) => response.json())
      .then((data) => setExpiredProducts(data))
      .catch((error) => console.error("Error fetching products: ", error));
  }, []);

  useEffect(() => {
    fetch(
      "https://us-central1-products-to-trash.cloudfunctions.net/getProductsAboutToExpire"
    )
      .then((response) => response.json())
      .then((data) => setAboutToExpiredProducts(data))
      .catch((error) => console.error("Error fetching products: ", error));
  }, []);

  const navigateToAddProduct = () => {
    navigate("/add-products");
  };
  const navigateToUserDetails = () => {
    navigate("/my-details");
  };

  const handleDeleteProducts = (selectedProducts, isExpired) => {
    selectedProducts.forEach((documentId) => {
      fetch(
        "https://us-central1-products-to-trash.cloudfunctions.net/deleteProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentId }),
        }
      )
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error: ", error));
    });
    const updateProductsState = isExpired
      ? expiredProducts
      : aboutToExpiredProducts;
    const updatedProducts = updateProductsState.filter(
      (product) => !selectedProducts.includes(product.id)
    );

    if (isExpired) {
      setExpiredProducts(updatedProducts);
      setSelectedExpiredProducts([]);
    } else {
      setAboutToExpiredProducts(updatedProducts);
      setSelectedAboutToExpireProducts([]);
    }
  };

  return (
    <>
      <div>
        <button onClick={navigateToAddProduct}>Add Product</button>
        <button onClick={navigateToUserDetails}>My details</button>
      </div>
      <TableOfProducts
        title="זרוק אותי"
        data={expiredProducts}
        onSelectedProductsChange={setSelectedExpiredProducts}
      />
      <button
        onClick={() => handleDeleteProducts(selectedExpiredProducts, true)}
      >
        מחק
      </button>
      <TableOfProducts
        title="תציל אותי לפני שאגמר"
        data={aboutToExpiredProducts}
        onSelectedProductsChange={setSelectedAboutToExpireProducts}
      />
      <button
        onClick={() =>
          handleDeleteProducts(selectedAboutToExpireProducts, false)
        }
      >
        מחק
      </button>
    </>
  );
}
