"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Shield,
  Trash2,
  UserPlus,
  X,
  Search,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Extended mock data for athletes with more entries for pagination
const athletes = [
  {
    id: 1,
    name: "John Doe",
    lastSync: "2023-05-15T14:30:00",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    lastSync: "2023-05-14T09:15:00",
    stravaConnected: true,
    notionConnected: false,
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastSync: "2023-05-13T16:45:00",
    stravaConnected: false,
    notionConnected: true,
  },
  {
    id: 4,
    name: "Sarah Williams",
    lastSync: "2023-05-12T11:20:00",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: 5,
    name: "Alex Brown",
    lastSync: "2023-05-11T13:10:00",
    stravaConnected: false,
    notionConnected: false,
  },
  {
    id: 6,
    name: "Emma Wilson",
    lastSync: "2023-05-10T08:30:00",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: 7,
    name: "David Lee",
    lastSync: "2023-05-09T17:45:00",
    stravaConnected: true,
    notionConnected: false,
  },
  {
    id: 8,
    name: "Lisa Garcia",
    lastSync: "2023-05-08T12:20:00",
    stravaConnected: false,
    notionConnected: true,
  },
  {
    id: 9,
    name: "Tom Anderson",
    lastSync: "2023-05-07T15:10:00",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: 10,
    name: "Kate Miller",
    lastSync: "2023-05-06T10:45:00",
    stravaConnected: false,
    notionConnected: false,
  },
  {
    id: 11,
    name: "Chris Davis",
    lastSync: "2023-05-05T14:30:00",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: 12,
    name: "Amy Taylor",
    lastSync: "2023-05-04T09:15:00",
    stravaConnected: true,
    notionConnected: false,
  },
  {
    id: 13,
    name: "James Wilson",
    lastSync: "2023-05-03T16:45:00",
    stravaConnected: false,
    notionConnected: true,
  },
  {
    id: 14,
    name: "Rachel Green",
    lastSync: "2023-05-02T11:20:00",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: 15,
    name: "Mark Thompson",
    lastSync: "2023-05-01T13:10:00",
    stravaConnected: false,
    notionConnected: false,
  },
];

export default function CoachDashboard() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionFilter, setConnectionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"name" | "lastSync">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 5;
  const { user, isLoaded, isSignedIn } = useUser();

  const role = user?.unsafeMetadata?.role as string | undefined;

  console.log(role, "role----------->");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Filter and sort athletes
  const filteredAndSortedAthletes = useMemo(() => {
    let filtered = athletes.filter((athlete) => {
      const matchesSearch = athlete.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        connectionFilter === "all" ||
        (connectionFilter === "connected" &&
          athlete.stravaConnected &&
          athlete.notionConnected) ||
        (connectionFilter === "strava-only" &&
          athlete.stravaConnected &&
          !athlete.notionConnected) ||
        (connectionFilter === "notion-only" &&
          !athlete.stravaConnected &&
          athlete.notionConnected) ||
        (connectionFilter === "disconnected" &&
          !athlete.stravaConnected &&
          !athlete.notionConnected);

      return matchesSearch && matchesFilter;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else {
        aValue = new Date(a.lastSync).getTime();
        bValue = new Date(b.lastSync).getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, connectionFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAthletes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAthletes = filteredAndSortedAthletes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field: "name" | "lastSync") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const generateInviteLink = () => {
    const uniqueCode = Math.random().toString(36).substring(2, 10);
    setInviteLink(`https://yourapp.com/invite/${uniqueCode}`);
    setInviteDialogOpen(true);
    setLinkCopied(false);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with your athlete.",
    });
  };

  const syncAthlete = (athleteId: number) => {
    toast({
      title: "Sync initiated",
      description: `Syncing data for athlete #${athleteId}...`,
    });
  };

  const removeAthlete = (athleteId: number) => {
    toast({
      title: "Athlete removed",
      description: `Athlete #${athleteId} has been removed from your list.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {role === "coach" ? "Coach Dashboard" : "Athlete Dashboard"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage your athletes and their connections
          </p>
        </div>
        {role !== "athlete" && (
          <Button
            onClick={generateInviteLink}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Generate Invite Link
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Connection Status Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <svg
                  className="mr-2 h-4 w-4 text-orange-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5 15.5L20 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 6.5C12 6.5 14.5 9.5 14.5 12C14.5 14.5 12 17.5 12 17.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.5 4C8.5 4 4 9 4 12C4 15 8.5 20 8.5 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Strava
              </span>
              <a
                href={`https://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI}&approval_prompt=auto&scope=read,activity:read`}
              >
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 px-3 py-1 font-medium">
                  <Check className="mr-1.5 h-3 w-3" />
                  Connected
                </Badge>
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <svg
                  className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 8H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 12H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 16H12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Notion
              </span>
              <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 px-3 py-1 font-medium">
                <X className="mr-1.5 h-3 w-3" />
                Not Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Last Sync Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Last Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Time:
              </span>
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                May 15, 2:30 PM
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Status:
              </span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 px-3 py-1 font-medium">
                <Check className="mr-1.5 h-3 w-3" />
                Success
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Now
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Plan:
              </span>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 px-3 py-1 font-semibold">
                Pro
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Expires:
              </span>
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Dec 31, 2023
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400"
              >
                Extend
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400"
              >
                Change
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Athletes Summary Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              Athletes Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total:
              </span>
              <span className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                {athletes.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Connected:
              </span>
              <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                {
                  athletes.filter((a) => a.stravaConnected && a.notionConnected)
                    .length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Synced Today:
              </span>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                3
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Athletes Table */}
      {role === "coach" && (
        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Your Athletes
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your athletes and their connections
                </CardDescription>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search athletes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Select
                  value={connectionFilter}
                  onValueChange={setConnectionFilter}
                >
                  <SelectTrigger className="w-full sm:w-48 border-gray-200 dark:border-gray-700">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by connection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Athletes</SelectItem>
                    <SelectItem value="connected">Fully Connected</SelectItem>
                    <SelectItem value="strava-only">Strava Only</SelectItem>
                    <SelectItem value="notion-only">Notion Only</SelectItem>
                    <SelectItem value="disconnected">Disconnected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800">
                    <TableHead className="w-[250px] py-4">
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent font-semibold text-gray-700 dark:text-gray-300"
                        onClick={() => handleSort("name")}
                      >
                        <span>Athlete Name</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="py-4">
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent font-semibold text-gray-700 dark:text-gray-300"
                        onClick={() => handleSort("lastSync")}
                      >
                        <span>Last Sync</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-700 dark:text-gray-300">
                      Strava
                    </TableHead>
                    {/* <TableHead className="py-4 font-semibold text-gray-700 dark:text-gray-300">Notion</TableHead> */}
                    <TableHead className="text-right py-4 font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAthletes.length > 0 ? (
                    paginatedAthletes.map((athlete) => (
                      <TableRow
                        key={athlete.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30 border-b border-gray-50 dark:border-gray-800/50"
                      >
                        <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                          {athlete.name}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400 py-4">
                          {formatDate(athlete.lastSync)}
                        </TableCell>
                        <TableCell className="py-4">
                          {athlete.stravaConnected ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 px-3 py-1.5 font-medium">
                              <Check className="mr-1.5 h-3 w-3" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 px-3 py-1.5 font-medium">
                              <X className="mr-1.5 h-3 w-3" />
                              Not Connected
                            </Badge>
                          )}
                        </TableCell>
                        {/* <TableCell className="py-4">
                        {athlete.notionConnected ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 px-3 py-1.5 font-medium">
                            <Check className="mr-1.5 h-3 w-3" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 px-3 py-1.5 font-medium">
                            <X className="mr-1.5 h-3 w-3" />
                            Not Connected
                          </Badge>
                        )}
                      </TableCell> */}
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => syncAthlete(athlete.id)}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/20"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-2">
                                Sync
                              </span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAthlete(athlete.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-2">
                                Remove
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Search className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                          <p className="font-medium">No athletes found</p>
                          <p className="text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredAndSortedAthletes.length
                  )}{" "}
                  of {filteredAndSortedAthletes.length} results
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                            className={
                              currentPage === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Invite Link Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Invite Athlete
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Share this unique link with your athlete to connect them to your
              dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <span className="text-sm truncate flex-1 font-mono text-gray-700 dark:text-gray-300">
                  {inviteLink}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyInviteLink}
              className={
                linkCopied
                  ? "text-green-600 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-950/20"
                  : "border-gray-200 dark:border-gray-700"
              }
            >
              {linkCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setInviteDialogOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
