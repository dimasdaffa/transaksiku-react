import Card from "../../../Components/Card";


export const UserBalance = ({ saldo }) => {
  return (
    <Card className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Saldo Anda</h3>
      <p className="text-2xl font-bold text-green-600">Rp {saldo.toLocaleString()}</p>
    </Card>
  );
};
