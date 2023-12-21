import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/FooterStyles.css";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
export default function Footer() {
    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
            />

            <footer className="footer-distributed">
                <div className="footer-left">
                    <h3>ClosetWear</h3>

                    <p className="footer-links"></p>

                    <p className="footer-company-name">ClosetWear © 2023</p>
                </div>

                <div className="footer-center">

                    <div>
                        <FontAwesomeIcon icon={faPhone} className="mr-1" />
                        <p>0851-5713-9911</p>
                    </div>
                </div>

                <div className="footer-right">
                    <p className="footer-company-about">
                        <span>About the company</span>
                        Every piece in our collection is crafted with care and
                        passion, bringing you not just fashion, but a touch of
                        Indonesian artistry. Join us in celebrating the beauty
                        of simplicity and the comfort of well-made clothing.
                        Step into ClosetWear - where every garment tells a story
                        of comfort, simplicity, and affordability. Your style
                        journey begins here!
                    </p>

                    <div className="footer-icons">
                        <ul></ul>
                    </div>
                </div>
            </footer>
        </>
    );
}
