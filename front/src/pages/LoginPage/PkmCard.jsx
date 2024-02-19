import {useState} from "react";

const Card = ({ image, index }) => {
    const [hovered, setHovered] = useState(false);

    const handleHover = () => {
        setHovered(true);
    };

    const handleLeave = () => {
        setHovered(false);
    };

    const styles = {
        position: 'fixed',
        bottom: -100,
        left: '50%',
        border: '1px solid #ccc',
        borderRadius: '5px',
        transition: 'all 0.3s ease',
        zIndex: index + 1,
        transform: `translateX(${(index - 3) * 150}px) translateY(${hovered ? Math.abs(index - 2) * 50 : Math.abs(index - 2) * 50 + 20}px) rotate(${-40 + (index * 20)}deg)`,
    };

    return (
        <div style={styles} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            <img src={image} alt={`Card ${index}`} style={{ width: '100%', height: '100%', borderRadius: '5px' }} />
        </div>
    );
};

export default Card;
