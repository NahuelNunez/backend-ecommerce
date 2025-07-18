import path from "path";

const nodemailer = require("nodemailer");
export const sendOrderEmail = async(order:any) => {
const userGMail= "chelitajoyas@gmail.com"
const passAppGmail="yigp ueqd haqf yquu"

const transporter = nodemailer.createTransport({
  
    service:'gmail',
    auth:{
        user:userGMail,
        pass:passAppGmail,
    },
});




const htmlResumen = `

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;padding:20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;padding:20px;font-family:sans-serif;">
        <tr>
          <td align="center">
            <h2 style="color:#333;">✅ ¡Tu pedido fue confirmado!</h2>
            <p style="color:#555;">Hola, ${order.nombre} ${order.apellido}, gracias por tu compra.</p>
          </td>
        </tr>

        <tr>
          <td>
            <h3 style="color:#333;">🛍️ Productos:</h3>
            <ul>
              ${order.productos
                .map(
                  (prod:any, index:Number) => `
                  <li style="margin-bottom:10px;">
                    <strong>${prod.titulo}</strong> x${prod.cantidad} - $${prod.precio}<br/>
                    <img src="cid:img-${index}" width="100" style="border-radius:6px;margin-top:5px;" />
                  </li>`
                )
                .join("")}
            </ul>
          </td>
        </tr>

        <tr>
          <td>
            <h3>Total: $${order.montoTotal}</h3>
            <p>Método de pago: ${order.metodoPago === "mercadoPago-basic" || order.metodoPago === "tarjeta" ?  "Billetera MercadoPago" : "Transferencia" }</p>
            <p>Tipo de entrega: ${order.tipoEntrega}</p>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding-top:20px;">
            <p style="background-color:#0ea5e9;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Nos comunicaremos via WhatasApp para la entrega o retiro del pedido.
            </p>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding-top:30px;">
            <p style="font-size:12px;color:#aaa;">Gracias por confiar en <span style="font-size:12px; color:#0ea5e9;">Chelitas Joyas</span></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`

  const allAttachments = [

    ...(order.comprobanteURL
      ? [
          {
            filename: order.comprobanteURL,
            path: path.resolve(`./uploads/${order.comprobanteURL}`),
          },
        ]
      : []),
  ];

 const mailOptions = {
    from: `"Chelita Joyas" <${userGMail}>`,
    to: order.email,
    html: htmlResumen,
    attachments:  allAttachments,
    
  };
   try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: ", info.response);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    
  }


}