"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { isAdminEmail } from "@/lib/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, RefreshCw, Users, UserCheck, UserPlus, TrendingUp, Crown, Dumbbell, UserX } from "lucide-react";

interface ClerkUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  createdAt: number;
  lastSignInAt: number | null;
  imageUrl: string;
}

interface Statistics {
  totalUsers: number;
  roleDistribution: {
    coaches: number;
    athletes: number;
    noRole: number;
  };
  recentSignups: number;
  activeUsers: number;
  growthRate: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Filters {
  sortBy: string;
  sortOrder: string;
  roleFilter: string;
  searchQuery: string;
}

interface UsersResponse {
  users: ClerkUser[];
  statistics: Statistics;
  pagination: PaginationInfo;
  filters: Filters;
}

export default function AdminPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalUsers: 0,
    roleDistribution: { coaches: 0, athletes: 0, noRole: 0 },
    recentSignups: 0,
    activeUsers: 0,
    growthRate: 0
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // If the user is not signed in and the clerk data is loaded, redirect to home
    if (isLoaded && !isSignedIn) {
      router.push('/');
      return;
    }

    // Check if user is admin
    if (user) {
      const userEmail = user.emailAddresses[0]?.emailAddress;
      if (!userEmail || !isAdminEmail(userEmail)) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  useEffect(() => {
    if (user && isAdminEmail(user.emailAddresses[0]?.emailAddress || '')) {
      fetchUsers();
    }
  }, [user, currentPage, pageSize, sortBy, sortOrder, roleFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
        ...(roleFilter && { role: roleFilter }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await fetch(`/api/admin/users?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setStatistics(data.statistics);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value === 'all' ? '' : value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('');
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'coach':
        return 'default';
      case 'athlete':
        return 'secondary';
      case 'admin':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  // Render loading state while user data is loading
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is admin
  const userEmail = user.emailAddresses[0]?.emailAddress;
  if (!userEmail || !isAdminEmail(userEmail)) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage all users and system settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user.firstName || 'Admin'}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
                <Users className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalUsers.toLocaleString()}</div>
                <p className="text-xs opacity-90">
                  +{statistics.recentSignups} this week
                </p>
              </CardContent>
            </Card>

            {/* Coaches Card */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Coaches</CardTitle>
                <Crown className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.roleDistribution.coaches.toLocaleString()}</div>
                <p className="text-xs opacity-90">
                  {((statistics.roleDistribution.coaches / statistics.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            {/* Athletes Card */}
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Athletes</CardTitle>
                <Dumbbell className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.roleDistribution.athletes.toLocaleString()}</div>
                <p className="text-xs opacity-90">
                  {((statistics.roleDistribution.athletes / statistics.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            {/* Active Users Card */}
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 opacity-90" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.activeUsers.toLocaleString()}</div>
                <p className="text-xs opacity-90">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Recent Signups Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.recentSignups}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                  {statistics.growthRate !== 0 && (
                    <span className={`ml-1 inline-flex items-center ${statistics.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {statistics.growthRate > 0 ? '+' : ''}{statistics.growthRate}%
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Users Without Role Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users Without Role</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.roleDistribution.noRole}</div>
                <p className="text-xs text-muted-foreground">
                  Need role assignment
                </p>
              </CardContent>
            </Card>

            {/* User Distribution Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Distribution</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coaches</span>
                    <span className="font-medium">{statistics.roleDistribution.coaches}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Athletes</span>
                    <span className="font-medium">{statistics.roleDistribution.athletes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>No Role</span>
                    <span className="font-medium">{statistics.roleDistribution.noRole}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Complete list of users registered in the system ({pagination.totalCount} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters and Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={roleFilter || 'all'} onValueChange={handleRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="coach">Coach</SelectItem>
                    <SelectItem value="athlete">Athlete</SelectItem>
                    <SelectItem value="No role set">No Role Set</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={clearFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('name')}
                              className="h-auto p-0 font-semibold"
                            >
                              User
                              {getSortIcon('name')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('email')}
                              className="h-auto p-0 font-semibold"
                            >
                              Email
                              {getSortIcon('email')}
                            </Button>
                          </TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('created_at')}
                              className="h-auto p-0 font-semibold"
                            >
                              Created
                              {getSortIcon('created_at')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('last_sign_in')}
                              className="h-auto p-0 font-semibold"
                            >
                              Last Sign In
                              {getSortIcon('last_sign_in')}
                            </Button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.imageUrl} alt={user.firstName || 'User'} />
                                <AvatarFallback>
                                  {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {user.firstName} {user.lastName}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {formatDate(user.createdAt)}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Never'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {users.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No users found</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-600">
                        Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                        {pagination.totalCount} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!pagination.hasPreviousPage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNumber;
                            if (pagination.totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (pagination.currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (pagination.currentPage >= pagination.totalPages - 2) {
                              pageNumber = pagination.totalPages - 4 + i;
                            } else {
                              pageNumber = pagination.currentPage - 2 + i;
                            }
                            
                            return (
                              <Button
                                key={pageNumber}
                                variant={pageNumber === pagination.currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNumber)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNumber}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 