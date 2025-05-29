import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { isAdminEmail } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user details to check if they're an admin
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail || !isAdminEmail(userEmail)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const roleFilter = searchParams.get('role') || '';
    const searchQuery = searchParams.get('search') || '';

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build Clerk query parameters
    const clerkParams: any = {
      limit,
      offset,
    };

    // Handle sorting
    const sortMapping: { [key: string]: string } = {
      'name': 'first_name',
      'email': 'email_address',
      'created_at': 'created_at',
      'last_sign_in': 'last_sign_in_at'
    };

    const clerkSortBy = sortMapping[sortBy] || 'created_at';
    clerkParams.orderBy = sortOrder === 'desc' ? `-${clerkSortBy}` : clerkSortBy;

    // Handle search query
    if (searchQuery) {
      clerkParams.query = searchQuery;
    }

    // Fetch users from Clerk
    const users = await client.users.getUserList(clerkParams);

    // Also fetch all users for statistics (with a higher limit)
    const allUsers = await client.users.getUserList({
      limit: 1000, // Get more users for statistics
      orderBy: '-created_at'
    });

    // Format and filter the users data
    let formattedUsers = users.data.map((user: any) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress || 'No email',
      role: user.unsafeMetadata?.role || 'No role set',
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      imageUrl: user.imageUrl,
    }));

    // Apply role filter if specified (client-side filtering since Clerk doesn't support metadata filtering)
    if (roleFilter) {
      formattedUsers = formattedUsers.filter(user => 
        user.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Calculate statistics from all users
    const allFormattedUsers = allUsers.data.map((user: any) => ({
      role: user.unsafeMetadata?.role || 'No role set',
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
    }));

    // Calculate role distribution
    const roleStats = allFormattedUsers.reduce((acc: any, user) => {
      const role = user.role;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    // Calculate recent signups (last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentSignups = allFormattedUsers.filter(user => user.createdAt > sevenDaysAgo).length;

    // Calculate active users (signed in within last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const activeUsers = allFormattedUsers.filter(user => 
      user.lastSignInAt && user.lastSignInAt > thirtyDaysAgo
    ).length;

    // Calculate growth (compare with previous 7 days)
    const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
    const previousWeekSignups = allFormattedUsers.filter(user => 
      user.createdAt > fourteenDaysAgo && user.createdAt <= sevenDaysAgo
    ).length;
    
    const growthRate = previousWeekSignups > 0 
      ? ((recentSignups - previousWeekSignups) / previousWeekSignups) * 100 
      : recentSignups > 0 ? 100 : 0;

    const statistics = {
      totalUsers: allUsers.totalCount,
      roleDistribution: {
        coaches: roleStats['coach'] || 0,
        athletes: roleStats['athlete'] || 0,
        noRole: roleStats['No role set'] || 0,
      },
      recentSignups,
      activeUsers,
      growthRate: Math.round(growthRate * 10) / 10, // Round to 1 decimal place
    };

    // Get total count for pagination
    const totalCount = users.totalCount;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users: formattedUsers,
      statistics,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      filters: {
        sortBy,
        sortOrder,
        roleFilter,
        searchQuery
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 