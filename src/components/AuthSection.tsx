import { useBodhi, isAuthLoggedIn } from '@bodhiapp/bodhi-js-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogIn, LogOut, User } from 'lucide-react';

export default function AuthSection() {
  const { auth, authLoading, login, logout } = useBodhi();

  const isLoggedIn = auth && isAuthLoggedIn(auth);
  const userInfo = isLoggedIn ? auth.userInfo : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>User authentication status and controls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Logged In</span>
                  <Badge variant="success">Authenticated</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Username: </span>
                    <span className="font-mono">{userInfo?.preferred_username || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    <span className="font-mono">{userInfo?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Name: </span>
                    <span className="font-mono">{userInfo?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={logout} variant="outline" size="sm" disabled={authLoading} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              {authLoading ? 'Logging out...' : 'Logout'}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Not authenticated</p>
            </div>
            <Button onClick={login} variant="default" size="sm" disabled={authLoading} className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              {authLoading ? 'Logging in...' : 'Login with Keycloak'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
