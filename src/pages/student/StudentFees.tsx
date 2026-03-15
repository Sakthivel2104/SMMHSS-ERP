import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const StudentFees = () => {
  const { user } = useAuth();
  const student = db.getStudents().find(s => s.userId === user?.id);
  const fees = db.getFeesByStudent(student?.id || 1);
  const pending = fees.filter(f => f.status === 'pending');
  const paid = fees.filter(f => f.status === 'paid');

  const statusIcons: Record<string, any> = {
    paid: { icon: CheckCircle, class: 'text-success' },
    pending: { icon: Clock, class: 'text-warning' },
    overdue: { icon: AlertTriangle, class: 'text-destructive' },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Fee Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Pending</p>
          <p className="text-3xl font-bold text-foreground mt-1">${pending.reduce((a, f) => a + f.amount, 0).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-3xl font-bold text-success mt-1">${paid.reduce((a, f) => a + f.amount, 0).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Fee Items</p>
          <p className="text-3xl font-bold text-foreground mt-1">{fees.length}</p>
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Fee Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Amount</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Due Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {fees.map(f => {
              const StatusIcon = statusIcons[f.status]?.icon || Clock;
              return (
                <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{f.type}</td>
                  <td className="p-4 text-sm text-foreground font-semibold">${f.amount.toLocaleString()}</td>
                  <td className="p-4 text-sm text-muted-foreground">{f.dueDate}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium capitalize ${statusIcons[f.status]?.class}`}>
                      <StatusIcon className="w-3 h-3" /> {f.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {f.status === 'pending' && (
                      <Button size="sm" onClick={() => toast.success('Payment gateway will be integrated')}>
                        <CreditCard className="w-3 h-3 mr-1" /> Pay
                      </Button>
                    )}
                    {f.status === 'paid' && <span className="text-xs text-muted-foreground">Paid {f.paidDate}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFees;
