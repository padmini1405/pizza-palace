import "../Styles/MenuSkeleton.css";

const MenuSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="menu-skeleton-card" key={index}>
          <div className="skeleton-image"></div>

          <div className="skeleton-content">
            <div className="skeleton-title"></div>

            <div className="skeleton-text"></div>

            <div className="skeleton-text short"></div>

            <div className="skeleton-price"></div>

            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MenuSkeleton;