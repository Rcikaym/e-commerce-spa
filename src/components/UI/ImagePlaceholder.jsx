import PropTypes from 'prop-types';
import './ImagePlaceholder.css';

const ImagePlaceholder = ({
  category,
  size = 'medium',
  className = '',
}) => {
  const classes = [
    'image-placeholder',
    `image-placeholder--${size}`,
    `image-placeholder--${category.toLowerCase()}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} aria-hidden="true">
      {category.charAt(0)}
    </div>
  );
};

ImagePlaceholder.propTypes = {
  category: PropTypes.oneOf(['Ceramics', 'Textiles', 'Stationery', 'Lighting'])
    .isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
};

export default ImagePlaceholder;
