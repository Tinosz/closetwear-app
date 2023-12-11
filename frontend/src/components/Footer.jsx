import "./styles/FooterStyles.css";
export default function Footer() {
    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                integrity="sha512-6HjJxj5l6iB4kJnHg3nYsVoE6+go25br0Y0P63yePvJ5VzCZi8qQ8C1A6jyRYk0WGig4sPVlWbL1a7DDtFbDQg=="
                crossorigin="anonymous"
                referrerpolicy="no-referrer"
            />

            <footer className="footer-distributed">
                <div className="footer-left">
                    <h3>ClosetWear</h3>

                    <p className="footer-links">
                        <a href="#" className="link-1">
                            Home
                        </a>

                        <a href="#">Blog</a>

                        <a href="#">Pricing</a>

                        <a href="#">About</a>

                        <a href="#">Faq</a>

                        <a href="#">Contact</a>
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
                        <i className="fa fa-envelope"></i>
                        <p>
                            <a href="mailto:support@company.com">
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
                            <a href="#">
                                <i className="fab fa-instagram instagram"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fab fa-whatsapp whatsapp"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fab fa-twitter twitter"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                </div>
            </footer>
        </>
    );
}
