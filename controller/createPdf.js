const PDFDocument = require("pdfkit-table");
const excelJS = require("exceljs");
const fs = require('fs');
const Order = require("../model/order");

const pdfDoc = async (req, res, next) => {
    try {
   
     const start_date = req.session.startDate ;
      const  end_date =  req.session.endDate;    

      const orders = await Order.find({
        createdAt: { $gte: start_date, $lte: end_date }
    }).populate('product.productId');

        const doc = new PDFDocument();
        const filename = 'orders.pdf';
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
        doc.pipe(res);

        doc.fontSize(20).text('Orders', { align: 'center' });
        doc.moveDown(2);
        doc.moveDown(1);

        const table = {
            headers: ['Order ID', 'Product', 'Quantity', 'Total'],
            rows: []
        };

        orders.forEach((order) => {
            order.product.forEach((product) => {
                table.rows.push([
                    order.orderId.slice(-6),
                    product.productId.name,
                    product.quantity.toString(),
                    `$${product.saleprice}`
                ]);
            });
        });

        doc.table(table, {
            width: 600,
            headerLines: 1,
            align: 'center',
        });

        doc.end();
    } catch (error) {
        // Handle error
        console.error(error);
        next(error)
    }
};



const excelSheet = async (req, res, next) => {
    try {

        const start_date = req.session.startDate;
        const end_date = req.session.endDate;
         
       
         console.log(start_date,end_date);

       
        const orders = await Order.find({
            createdAt: { $gte: start_date, $lte: end_date }
        }).populate('product.productId'); 

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User");

        worksheet.columns = [
            { header: "OrderId", key: "Order_id", width: 15 },
            { header: "Product_name", key: "Product_name", width: 80 },
            { header: "Quantity", key: "Quantity", width: 25 },
            { header: "Sale_Price", key: "Sale_Price", width: 10 },
        ];

        // Add data to the worksheet
        orders.forEach(order => {
            order.product.forEach(product => {
                worksheet.addRow({
                    Order_id: order.orderId.slice(-6),
                    Product_name: product.productId.name,
                    Quantity: product.quantity.toString(),
                    Sale_Price: product.saleprice.toString() 
                });
            });
        });

    
        const buffer = await workbook.xlsx.writeBuffer();

      
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

        // Send the buffer data to the frontend
        res.send(buffer);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = excelSheet;


module.exports = excelSheet;





module.exports = {
    pdfDoc,
    excelSheet

}