$(document).ready(function () {
    getAllOrders();
});

function getAllOrders(){
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/getall",
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#tableOrderBody").empty();
            $.each(response.data, function (index, order) {
                let row = `<tr>
                    <td>${order.orderId}</td>
                    <td>${order.orderDate}</td>
                    <td>${order.totalPrice}</td>
                    <td>${order.paymentMethod}</td>
                    <td>${order.addedPoints}</td>
                    <td>${order.customerName}</td>
                    <td>${order.cashierName}</td>  
                    <td class="d-none">${order.customer}</td> 
                    <td class="d-none">${order.employee}</td> 
                    <td class="order-details-button-td d-flex align-items-center">
                        <div class="d-flex">
                        <i class="fa-solid fa-binoculars" title="view" onclick="viewOrderDetails($(this))"></i>
                        <i class="fa-solid fa-arrow-rotate-left ml-3" title="refund" onclick="refundOrder($(this))"></i>
                        </div>                      
                    </td>
                    </tr>`;
                $('#tableOrderBody').append(row);
            });

            // onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving orders failed.")
            console.log(jqxhr);
        }
    })
}

$("#btnGetAll").click(function (){
    getAllOrders();
    $("#searchField").val("");
})

$("#searchField").keyup(function (){
    let prefix = $("#searchField").val();

    if(prefix == ""){
        getAllOrders();
        return;
    }

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/searchByCode/" + prefix,
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            if(response.data.length == 0){
                $("#tableOrderBody").empty();
                let row = `<tr>
                    <td class="py-5" colspan="8">No Result Found</td>                                       
                    </tr>`;
                $('#tableOrderBody').append(row);
                return;
            }

            $("#tableOrderBody").empty();
            $.each(response.data, function (index, order) {

                let row = `<tr>
                    <td>${order.orderId}</td>
                    <td>${order.orderDate}</td>
                    <td>${order.totalPrice}</td>
                    <td>${order.paymentMethod}</td>
                    <td>${order.addedPoints}</td>
                    <td>${order.customerName}</td>
                    <td>${order.cashierName}</td>  
                    <td class="d-none">${order.customer}</td>   
                    <td class="d-none">${order.employee}</td> 
                    <td class="order-details-button-td d-flex align-items-center">
                        <div class="d-flex">
                        <i class="fa-solid fa-binoculars" title="view" onclick="viewOrderDetails($(this))"></i>
                        <i class="fa-solid fa-arrow-rotate-left ml-3" title="refund" onclick="refundOrder($(this))"></i>
                        </div>                      
                    </td>
                    </tr>`;
                $('#tableOrderBody').append(row);
            });

            onTableRowClicked();
        },
        error: function (jqxhr, textStatus, error) {
            alert("searching orders failed.")
            console.log(jqxhr);
        }
    })
})

function viewOrderDetails(elm){
    let orderId = elm.closest('tr').find('td:first').text();
    console.log(orderId);

    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/getOrderDetailsById/" + orderId,
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            $("#tableOrderDetailBody").empty();
            $.each(response.data, function (index, order) {
                let row = `<tr>
                    <td>${order.itemCode}</td>
                    <td>${order.itemName}</td>
                    <td>${order.size}</td>
                    <td>${order.qty}</td>
                    <td>${order.unitPrice}</td>
                    </tr>`
                $("#tableOrderDetailBody").append(row);
            });

            $("#detailModal").modal('show');
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving order details failed.")
            console.log(jqxhr);
        }
    })

}

function refundOrder(elm){
    let orderId = elm.closest('tr').find('td:first').text();
    console.log(orderId);

    let itemList = [];
    $.ajax({
        url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/getOrderDetailsById/" + orderId,
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            $.each(response.data, function (index, order) {
                let item = {
                    itemCode: order.itemCode,
                    size: order.size,
                    qty: order.qty
                }
                itemList.push(item);
            });

            let addedPoints = elm.closest('tr').find('td:eq(4)').text();
            let totalPrice = elm.closest('tr').find('td:eq(2)').text();
            let customer_code = elm.closest('tr').find('td:eq(7)').text();
            let cashier_name = elm.closest('tr').find('td:eq(6)').text();
            let paymentMethod = elm.closest('tr').find('td:eq(3)').text();
            let employee_code = elm.closest('tr').find('td:eq(8)').text();

            $.ajax({
                url: "http://localhost:8080/hello_shoes/api/v1/orderdetails/refund",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({"orderId": orderId, "totalPrice": totalPrice, "addedPoints": addedPoints,
                    "employee": employee_code, "customer": customer_code, "orderDetailList": itemList, "cashierName": cashier_name,
                    "paymentMethod": paymentMethod
                }),
                success: function (response) {
                    console.log(response);
                    alert("Order refunded successfully");

                    getAllOrders();
                },
                error: function (jqxhr, textStatus, error) {
                    alert("refunding order failed.")
                    console.log(jqxhr);
                }
            })
        },
        error: function (jqxhr, textStatus, error) {
            alert("retrieving order details failed. inside refund order.")
            console.log(jqxhr);
        }
    })
}