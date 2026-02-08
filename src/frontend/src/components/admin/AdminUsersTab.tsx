import { useListApprovals, useSetApproval } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { ApprovalStatus } from '../../backend';

export default function AdminUsersTab() {
  const { data: approvals, isLoading } = useListApprovals();
  const setApproval = useSetApproval();

  const handleApproval = async (userPrincipal: string, status: ApprovalStatus) => {
    await setApproval.mutateAsync({ userPrincipal, status });
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.approved:
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case ApprovalStatus.rejected:
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case ApprovalStatus.pending:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingApprovals = approvals?.filter(a => a.status === ApprovalStatus.pending) || [];
  const approvedUsers = approvals?.filter(a => a.status === ApprovalStatus.approved) || [];
  const rejectedUsers = approvals?.filter(a => a.status === ApprovalStatus.rejected) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">User Management</h2>
        <p className="text-muted-foreground">Manage user approvals and access</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingApprovals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rejectedUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Approvals</CardTitle>
          <CardDescription>Review and manage user access requests</CardDescription>
        </CardHeader>
        <CardContent>
          {approvals && approvals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Principal ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => (
                  <TableRow key={approval.principal.toString()}>
                    <TableCell className="font-mono text-sm">
                      {approval.principal.toString().slice(0, 20)}...
                    </TableCell>
                    <TableCell>{getStatusBadge(approval.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {approval.status !== ApprovalStatus.approved && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApproval(approval.principal.toString(), ApprovalStatus.approved)}
                          disabled={setApproval.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {approval.status !== ApprovalStatus.rejected && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(approval.principal.toString(), ApprovalStatus.rejected)}
                          disabled={setApproval.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Users Yet</h3>
              <p className="text-muted-foreground">User approval requests will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
