import { WalletStats } from "./WalletStats";
import { WalletTransactions } from "./WalletTransactions";
import { WalletClosings } from "./WalletClosings";

export function WalletContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Carteira</h2>
        <WalletStats />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações</h3>
        <WalletTransactions />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fechamentos Mensais</h3>
        <WalletClosings />
      </div>
    </div>
  );
}