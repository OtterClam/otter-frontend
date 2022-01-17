import { PropsWithChildren } from 'react';

interface Props {
  title: string;
}
const DetailRow = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <div className="detail-row">
      <p className="bond-balance-title">{title}</p>
      <p className="bond-balance-value">{children}</p>
    </div>
  );
};
export default DetailRow;
