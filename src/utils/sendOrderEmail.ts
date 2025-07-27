import path from "path"
const nodemailer = require("nodemailer")

export const sendOrderEmail = async (order: any) => {
  const userGMail = "chelitajoyas@gmail.com"
  const passAppGmail = "yigp ueqd haqf yquu"

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userGMail,
      pass: passAppGmail,
    },
  })

  const htmlResumen = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%); border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); overflow: hidden;">
            
            <!-- Header con gradiente azul -->
            <tr>
              <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0276abff 100%); padding: 30px 40px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  ✨ Chelitas Joyas ✨
                </h1>
              </td>
            </tr>

            <!-- Confirmación del pedido -->
            <tr>
              <td style="padding: 40px; text-align: center; background: #2a2a2a;">
                <div style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 8px 16px rgba(74, 222, 128, 0.2);">
                  <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                    🎉 ¡Tu pedido fue confirmado!
                  </h2>
                </div>
                <p style="color: #e5e5e5; font-size: 18px; margin: 0; line-height: 1.6;">
                  Hola <span style="color: #0ea5e9; font-weight: bold;">${order.nombre} ${order.apellido}</span>, 
                  <br/>gracias por confiar en nosotros para tu compra.
                </p>
              </td>
            </tr>

            <!-- Productos -->
            <tr>
              <td style="padding: 0 40px 30px 40px;">
                <div style="background: #1e1e1e; border-radius: 12px; padding: 30px; border: 1px solid #404040;">
                  <h3 style="color: #0ea5e9; font-size: 20px; margin: 0 0 20px 0;">
                    🛍️ Tus productos:
                  </h3>
                  <div>
                    ${order.productos
                      .map(
                        (prod: any, index: number) => `
                        <div style="background: #2a2a2a; border-radius: 8px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #0ea5e9;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="vertical-align: top; width: 100px; padding-right: 15px;">
                                ${
                                  prod.imagen
                                    ? `
                                  <img src="cid:product-img-${index}" width="80" height="80" style="border-radius: 8px; object-fit: cover; border: 2px solid #404040; display: block;" />
                                `
                                    : `
                                  <div style="width: 80px; height: 80px; background: #404040; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #888;">
                                    📦
                                  </div>
                                `
                                }
                              </td>
                              <td style="vertical-align: top;">
                                <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
                                  ${prod.titulo}
                                </h4>
                                <p style="color: #a3a3a3; margin: 0 0 8px 0; font-size: 14px;">
                                  Cantidad: <span style="color: #0ea5e9; font-weight: bold;">×${prod.cantidad}</span>
                                </p>
                                <p style="color: #4ade80; font-size: 18px; font-weight: bold; margin: 0;">
                                  $${prod.precio}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </div>
                        `,
                      )
                      .join("")}
                  </div>
                </div>
              </td>
            </tr>

            <!-- Resumen del pedido -->
            <tr>
              <td style="padding: 0 40px 30px 40px;">
                <div style="background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%); border-radius: 12px; padding: 30px; border: 1px solid #404040;">
                  <div style="border-bottom: 1px solid #404040; padding-bottom: 20px; margin-bottom: 20px;">
                    <h3 style="color: #0ea5e9; font-size: 24px; margin: 0; text-align: center;">
                      💰 Total: <span style="color: #4ade80;">$${order.montoTotal}</span>
                    </h3>
                  </div>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 15px;">
                        <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; border-left: 3px solid #3b82f6;">
                          <p style="color: #a3a3a3; margin: 0 0 5px 0; font-size: 14px;">Método de pago:</p>
                          <p style="color: #ffffff; margin: 0; font-weight: bold;">
                            ${
                              order.metodoPago === "mercadoPago-basic" || order.metodoPago === "tarjeta"
                                ? "💳 Billetera MercadoPago"
                                : "🏦 Transferencia Bancaria"
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; border-left: 3px solid #8b5cf6;">
                          <p style="color: #a3a3a3; margin: 0 0 5px 0; font-size: 14px;">Tipo de entrega:</p>
                          <p style="color: #ffffff; margin: 0; font-weight: bold;">
                            🚚 ${order.tipoEntrega}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <!-- Mensaje de contacto -->
            <tr>
              <td style="padding: 0 40px 40px 40px;">
                <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 8px 16px rgba(5, 150, 105, 0.2);">
                  <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: bold; line-height: 1.6;">
                    📱 Nos comunicaremos vía WhatsApp<br/>
                    para coordinar la entrega o retiro del pedido
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #1a1a1a; padding: 30px 40px; text-align: center; border-top: 1px solid #404040;">
                <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                  Gracias por confiar en
                </p>
                <p style="color: #0ea5e9; margin: 0; font-size: 18px; font-weight: bold;">
                  ✨ Chelitas Joyas ✨
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333333;">
                  <p style="color: #888888; margin: 0; font-size: 12px;">
                    Este es un email automático, por favor no responder.
                  </p>
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  `

  // ✅ SOLUCIÓN: Crear attachments correctos para las imágenes de productos
  const productImageAttachments = order.productos
    .map((prod: any, index: number) => {
      if (prod.imagen && prod.imagen.trim() !== "") {
        // ✅ Usar directamente la carpeta uploads
        const imagePath = path.resolve(`./uploads/${prod.imagen}`)
        console.log(`Intentando adjuntar imagen: ${imagePath}`) // Debug
        return {
          filename: prod.imagen,
          path: imagePath,
          cid: `product-img-${index}`,
        }
      }
      return null
    })
    .filter(Boolean)

  console.log(`Total de imágenes de productos a adjuntar: ${productImageAttachments.length}`) // Debug

  const allAttachments = [
    // Comprobante de pago (si existe)
    ...(order.comprobanteURL
      ? [
          {
            filename: order.comprobanteURL,
            path: path.resolve(`./uploads/${order.comprobanteURL}`),
          },
        ]
      : []),
    // Imágenes de productos
    ...productImageAttachments,
  ]

  const mailOptions = {
    from: `"Chelitas Joyas" <${userGMail}>`,
    to: order.email,
    subject: "✨ Confirmación de tu pedido - Chelitas Joyas",
    html: htmlResumen,
    attachments: allAttachments,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Correo enviado: ", info.response)
    console.log("Attachments enviados:", allAttachments.length)
    return { success: true, info }
  } catch (error) {
    console.error("Error al enviar el correo:", error)
    return { success: false, error }
  }
}
