import './SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__image" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__line skeleton-card__line--wide" />
        <div className="skeleton-card__line skeleton-card__line--medium" />
        <div className="skeleton-card__line skeleton-card__line--short" />
      </div>
    </div>
  );
};

export default SkeletonCard;
