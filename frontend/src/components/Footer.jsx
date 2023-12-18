import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/FooterStyles.css";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
export default function Footer() {
    return (
        <>
              <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'/>


            <footer className="footer-distributed">
                <div className="footer-left">
                    <h3>ClosetWear</h3>

                    <p className="footer-links">
                    </p>

                    <p className="footer-company-name">ClosetWear © 2023</p>
                </div>

                <div className="footer-center">
                    <div>
                        <i className="fa fa-map-marker"></i>
                        <p>
                            <span>444 S. Cedros Ave</span> Solana Beach,
                            California
                        </p>
                    </div>

                    <div>
                        <i className="fa fa-phone"></i>
                        <p>+1.555.555.5555</p>
                    </div>

                    <div>
                        <p>
                            <a href="mailto:support@company.com">
                        <FontAwesomeIcon icon={faEnvelope} />
                                ClosetWear@gmail.com
                            </a>
                        </p>
                    </div>
                </div>

                <div className="footer-right">
                    <p className="footer-company-about">
                        <span>About the company</span>
                        Lorem ipsum dolor sit amet, consectateur adispicing
                        elit. Fusce euismod convallis velit, eu auctor lacus
                        vehicula sit amet.
                    </p>

                    <div className="footer-icons">
                        <ul>
                            <li>
                                <a href="https://www.instagram.com/closetwear.id/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==">
                                    <i className="fa-brands fa-instagram instagram"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fa-brands fa-whatsapp whatsapp"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fa-brands fa-twitter twitter"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}
