type navbarProps = {
    onReset: () => void;
}

export default function Navbar({onReset}: navbarProps) {
    return (
              <nav className = "navbar">
        <ul>
            <li className="pokeLogo">
                <a href="index.html">
                    <img src="Pokemon_Logo-removebg-preview.png" alt="Please Micheal"/>
                </a>
            </li>
            <li className="dropdown1">
                <a href="#" className="dropdown1_trigger">Generation <span className="dropdown1_caret">▾</span></a>
                <ul className="dropdown1_panel">
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 1</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 2</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 3</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 4</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 5</a></li>
                    <li><a href="#"><span className="dropdown1_icon">&#9670;</span> Gen 6</a></li>
                </ul>
            </li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onReset(); }}>Reset</a></li>
        </ul>
    </nav>
    )
}