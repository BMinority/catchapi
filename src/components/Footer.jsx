import { FaLinkedin, FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bc-footer">
      <div className="bc-footer-content">
        <p>Desenvolvido por <strong>Bruno Coelho</strong></p>
        <div className="bc-footer-links">
          <a
            href="https://www.linkedin.com/in/dev-bcoelho/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Bruno Coelho"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/BMinority"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub de Bruno Coelho"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
