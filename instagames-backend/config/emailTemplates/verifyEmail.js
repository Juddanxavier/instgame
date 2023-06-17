/**
 * Returns html template for email verification
 * @param {Object} user - Object containing user details
 * @param {String} link - Link to redirect to the frontend application
 */
const verifyEmailTemplate = (user, otp) => {
  return `
  <!DOCTYPE html>

  <html
    lang="en"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml"
  >
    <head>
      <title></title>
      <meta charset="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <!--[if mso
        ]><xml
          ><o:OfficeDocumentSettings
            ><o:PixelsPerInch>96</o:PixelsPerInch
            ><o:AllowPNG /></o:OfficeDocumentSettings></xml
      ><![endif]-->
      <style>
        * {
          box-sizing: border-box;
        }
  
        body {
          margin: 0;
          padding: 0;
        }
  
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }
  
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }
  
        p {
          line-height: inherit;
        }
  
        @media (max-width: 660px) {
          .icons-inner {
            text-align: center;
          }
  
          .icons-inner td {
            margin: 0 auto;
          }
  
          .row-content {
            width: 100% !important;
          }
  
          .image_block img.big {
            width: auto !important;
          }
  
          .stack .column {
            width: 100%;
            display: block;
          }
        }
      </style>
    </head>
    <body
      style="
        background-color: #f8f8f9;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
      "
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="nl-container"
        role="presentation"
        style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          background-color: #f8f8f9;
        "
        width="100%"
      >
        <tbody>
          <tr>
            <td>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-1"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #4F46E5;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #4F46E5;
                          color: #000000;
                          width: 640px;
                        "
                        width="640"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td>
                                    <div align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 4px solid #4F46E5;
                                            "
                                          >
                                            <span></span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-2"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #fff;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #fff;
                          color: #000000;
                          width: 640px;
                        "
                        width="640"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 25px;
                                      padding-top: 22px;
                                      width: 100%;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    "
                                  >
  
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-3"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #f8f8f9;
                          color: #000000;
                          width: 640px;
                        "
                        width="640"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 5px;
                                padding-bottom: 5px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="20"
                                cellspacing="0"
                                class="divider_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td>
                                    <div align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 0px solid #bbbbbb;
                                            "
                                          >
                                            <span></span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-4"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #fff;
                          color: #000000;
                          width: 640px;
                        "
                        width="640"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 12px;
                                      padding-top: 60px;
                                    "
                                  >
                                    <div align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 0px solid #bbbbbb;
                                            "
                                          >
                                            <span></span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-left: 40px;
                                      padding-right: 40px;
                                      width: 100%;
                                    "
                                  >
                                    
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td style="padding-top: 50px">
                                    <div align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 0px solid #bbbbbb;
                                            "
                                          >
                                            <span></span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="text_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    padding-bottom: 10px;
                                    padding-left: 40px;
                                    padding-right: 40px;
                                    padding-top: 10px;
                                  "
                                >
                                  <div style="font-family: sans-serif">
                                    <div
                                      style="
                                        font-size: 12px;
                                        mso-line-height-alt: 14.399999999999999px;
                                        color: #555555;
                                        line-height: 1.2;
                                        font-family: Montserrat, Trebuchet MS,
                                          Lucida Grande, Lucida Sans Unicode,
                                          Lucida Sans, Tahoma, sans-serif;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 16px;
                                          text-align: center;
                                        "
                                      >
                                        <span
                                          style="
                                            font-size: 25px;
                                            color: #2b303a;
                                          "
                                          ><strong>
                                              OTP : ${otp}</strong
                                          ></span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 40px;
                                      padding-right: 40px;
                                      padding-top: 10px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        style="
                                          font-size: 12px;
                                          mso-line-height-alt: 14.399999999999999px;
                                          color: #555555;
                                          line-height: 1.2;
                                          font-family: Montserrat, Trebuchet MS,
                                            Lucida Grande, Lucida Sans Unicode,
                                            Lucida Sans, Tahoma, sans-serif;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 16px;
                                            text-align: center;
                                          "
                                        >
                                          <span
                                            style="
                                              font-size: 30px;
                                              color: #2b303a;
                                            "
                                            ><strong
                                              >Hi ${user.name}, Verify Your Email Account</strong
                                            ></span
                                          >
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 40px;
                                      padding-right: 40px;
                                      padding-top: 10px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        style="
                                          font-size: 12px;
                                          font-family: Montserrat, Trebuchet MS,
                                            Lucida Grande, Lucida Sans Unicode,
                                            Lucida Sans, Tahoma, sans-serif;
                                          mso-line-height-alt: 18px;
                                          color: #555555;
                                          line-height: 1.5;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 22.5px;
                                          "
                                        >
                                          <span
                                            style="
                                              color: #808389;
                                              font-size: 15px;
                                            "
                                            >You're almost done. Verify your email
                                            address and unlock the full potential
                                            of your Property Yards account.</span
                                          >
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 40px;
                                      padding-right: 40px;
                                      padding-top: 10px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        style="
                                          font-size: 12px;
                                          font-family: Montserrat, Trebuchet MS,
                                            Lucida Grande, Lucida Sans Unicode,
                                            Lucida Sans, Tahoma, sans-serif;
                                          mso-line-height-alt: 18px;
                                          color: #555555;
                                          line-height: 1.5;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 22.5px;
                                          "
                                        >
                                          <span
                                            style="
                                              color: #808389;
                                              font-size: 15px;
                                            "
                                            >Confirming your email address helps
                                            improve your account security and
                                            could help you recover your account if
                                            you forget your password.</span
                                          >
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                       
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 12px;
                                      padding-top: 60px;
                                    "
                                  >
                                    <div align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 0px solid #bbbbbb;
                                            "
                                          >
                                            <span></span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-5"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #f8f8f9;
                          color: #000000;
                          width: 640px;
                        "
                        width="640"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 5px;
                                padding-bottom: 5px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="20"
                                cellspacing="0"
                                class="divider_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td>
                                    <div align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 0px solid #bbbbbb;
                                            "
                                          >
                                            <span></span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-6"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #2b303a;
                          color: #000000;
                          width: 640px;
                        "
                        width="640"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td>
                                    <div align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 4px solid #4F46E5;
                                            "
                                          >
                                            <span></span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="social_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 10px;
                                      padding-right: 10px;
                                      padding-top: 28px;
                                      text-align: center;
                                    "
                                  >
                                    <table
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="social-table"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                      "
                                      width="208px"
                                    >
                                      <tr>
                                        <td style="padding: 0 10px 0 10px">
                                          <a
                                            href="https://www.facebook.com/"
                                            target="_blank"
                                            ><img
                                              alt="Facebook"
                                              height="32"
                                              src="https://fanstime.s3.ap-southeast-2.amazonaws.com/static/social_media/facebook2x.png"
                                              style="
                                                display: block;
                                                height: auto;
                                                border: 0;
                                              "
                                              title="Facebook"
                                              width="32"
                                          /></a>
                                        </td>
                                        <td style="padding: 0 10px 0 10px">
                                          <a
                                            href="https://twitter.com/"
                                            target="_blank"
                                            ><img
                                              alt="Twitter"
                                              height="32"
                                              src="https://fanstime.s3.ap-southeast-2.amazonaws.com/static/social_media/twitter2x.png"
                                              style="
                                                display: block;
                                                height: auto;
                                                border: 0;
                                              "
                                              title="Twitter"
                                              width="32"
                                          /></a>
                                        </td>
                                        <td style="padding: 0 10px 0 10px">
                                          <a
                                            href="https://instagram.com/"
                                            target="_blank"
                                            ><img
                                              alt="Instagram"
                                              height="32"
                                              src="https://fanstime.s3.ap-southeast-2.amazonaws.com/static/social_media/instagram2x.png"
                                              style="
                                                display: block;
                                                height: auto;
                                                border: 0;
                                              "
                                              title="Instagram"
                                              width="32"
                                          /></a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 40px;
                                      padding-right: 40px;
                                      padding-top: 15px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        style="
                                          font-size: 12px;
                                          font-family: Montserrat, Trebuchet MS,
                                            Lucida Grande, Lucida Sans Unicode,
                                            Lucida Sans, Tahoma, sans-serif;
                                          mso-line-height-alt: 18px;
                                          color: #555555;
                                          line-height: 1.5;
                                        "
                                      >
                                        <!-- <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: left;
                                            mso-line-height-alt: 18px;
                                          "
                                        >
                                          <span
                                            style="
                                              color: #95979c;
                                              font-size: 12px;
                                            "
                                            >Etiam quis tempus ex. Sed vitae ipsum
                                            suscipit, ultricies odio vitae,
                                            suscipit massa. Sed tempus ipsum eget
                                            diam aliquam maximus. Cras accumsan
                                            urna vel rutrum lobortis. Maecenas
                                            tristique purus vel ex tempor
                                            consequat. Curabitur dui massa, congue
                                            sed sem at, rhoncus imperdiet sem.
                                            Fusce ac orci fermentum, malesuada
                                            dolor a, cursus augue. Quisque
                                            porttitor sapien arcu, quis iaculis
                                            nisi faucibus eget. Vestibulum eu
                                            velit rhoncus, aliquam ante eget,
                                            tristique diam dui massa, congue sed
                                            sem at, rhoncus usce ac orci
                                            fermentum,.</span
                                          >
                                        </p> -->
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="divider_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 40px;
                                      padding-right: 40px;
                                      padding-top: 25px;
                                    "
                                  >
                                    <div align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #555961;
                                            "
                                          >
                                            <span></span>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding-bottom: 30px;
                                      padding-left: 40px;
                                      padding-right: 40px;
                                      padding-top: 20px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        style="
                                          font-size: 12px;
                                          font-family: Montserrat, Trebuchet MS,
                                            Lucida Grande, Lucida Sans Unicode,
                                            Lucida Sans, Tahoma, sans-serif;
                                          mso-line-height-alt: 14.399999999999999px;
                                          color: #555555;
                                          line-height: 1.2;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: left;
                                          "
                                        >
                                          <p
                                            style="
                                              color: #95979c;
                                              font-size: 12px;
                                              text-align: center;
                                            "
                                            >Property Yards Copyright © 2021</p
                                          >
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- End -->
    </body>
  </html>
`;
};

module.exports = verifyEmailTemplate;
