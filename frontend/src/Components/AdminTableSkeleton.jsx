import "../Styles/AdminTableSkeleton.css";

const AdminTableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index}>
          <td>
            <div className="table-skeleton-img"></div>
          </td>

          <td>
            <div className="table-skeleton-title"></div>
            <div className="table-skeleton-text"></div>
          </td>

          <td>
            <div className="table-skeleton-badge"></div>
          </td>

          <td>
            <div className="table-skeleton-price"></div>
          </td>

          <td>
            <div className="table-skeleton-toggle"></div>
          </td>

          <td>
            <div className="table-skeleton-actions"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default AdminTableSkeleton;