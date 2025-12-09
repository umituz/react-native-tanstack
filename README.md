# @umituz/react-native-tanstack

TanStack Query configuration and utilities for React Native apps with AsyncStorage persistence.

## Features

- ✅ **Pre-configured QueryClient** - Sensible defaults out of the box
- ✅ **AsyncStorage Persistence** - Automatic cache restoration on app restart
- ✅ **Cache Strategies** - Pre-defined strategies for different data types
- ✅ **Query Key Factories** - Type-safe key generation patterns
- ✅ **Pagination Helpers** - Cursor and offset-based pagination
- ✅ **Optimistic Updates** - Easy optimistic UI with automatic rollback
- ✅ **Dev Tools** - Built-in logging for development
- ✅ **General Purpose** - Works with Firebase, REST, GraphQL, any async data source

## Installation

```bash
npm install @umituz/react-native-tanstack
```

### Peer Dependencies

```bash
npm install @tanstack/react-query @react-native-async-storage/async-storage
```

## Usage

### Basic Setup

```typescript
import { TanstackProvider } from '@umituz/react-native-tanstack';

function App() {
  return (
    <TanstackProvider>
      <YourApp />
    </TanstackProvider>
  );
}
```

### Custom Configuration

```typescript
import { TanstackProvider, TIME_MS } from '@umituz/react-native-tanstack';

function App() {
  return (
    <TanstackProvider
      queryClientOptions={{
        defaultStaleTime: 10 * TIME_MS.MINUTE,
        enableDevLogging: __DEV__,
      }}
      persisterOptions={{
        keyPrefix: 'myapp',
        maxAge: 24 * TIME_MS.HOUR,
        busterVersion: '1',
      }}
      onPersistSuccess={() => console.log('Cache restored!')}
    >
      <YourApp />
    </TanstackProvider>
  );
}
```

### Cache Strategies

```typescript
import { useQuery, CacheStrategies } from '@umituz/react-native-tanstack';

// Real-time data (always refetch)
const { data: liveScore } = useQuery({
  queryKey: ['score'],
  queryFn: fetchScore,
  ...CacheStrategies.REALTIME,
});

// User data (medium cache)
const { data: profile } = useQuery({
  queryKey: ['profile'],
  queryFn: fetchProfile,
  ...CacheStrategies.USER_DATA,
});

// Master data (long cache)
const { data: countries } = useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  ...CacheStrategies.MASTER_DATA,
});

// Public data (medium-long cache)
const { data: posts } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  ...CacheStrategies.PUBLIC_DATA,
});
```

### Query Key Factories

```typescript
import { createQueryKeyFactory } from '@umituz/react-native-tanstack';

const postKeys = createQueryKeyFactory('posts');

// All posts
postKeys.all(); // ['posts']

// Posts list
postKeys.lists(); // ['posts', 'list']

// Posts with filters
postKeys.list({ status: 'published' }); // ['posts', 'list', { status: 'published' }]

// Single post
postKeys.detail(123); // ['posts', 'detail', 123]

// Custom key
postKeys.custom('trending'); // ['posts', 'trending']
```

### Pagination

```typescript
import { useCursorPagination } from '@umituz/react-native-tanstack';

function FeedScreen() {
  const { data, flatData, fetchNextPage, hasNextPage, isFetchingNextPage } = useCursorPagination({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed({ cursor: pageParam, limit: 20 }),
    limit: 20,
  });

  return (
    <FlatList
      data={flatData}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
    />
  );
}
```

### Cache Invalidation

```typescript
import { useInvalidateQueries } from '@umituz/react-native-tanstack';

function ShareButton() {
  const invalidate = useInvalidateQueries();

  const handleShare = async () => {
    await shareToFeed(post);

    // Invalidate feed queries
    await invalidate(['feed']);
  };

  return <Button onPress={handleShare}>Share</Button>;
}
```

### Optimistic Updates

```typescript
import { useOptimisticUpdate } from '@umituz/react-native-tanstack';

function LikeButton({ postId }) {
  const updateLike = useOptimisticUpdate<Post, { liked: boolean }>({
    mutationFn: (variables) => api.updatePost(postId, variables),
    queryKey: ['posts', 'detail', postId],
    updater: (oldPost, variables) => ({
      ...oldPost,
      liked: variables.liked,
      likeCount: oldPost.likeCount + (variables.liked ? 1 : -1),
    }),
  });

  const handleLike = () => {
    updateLike.mutate({ liked: true });
  };

  return <Button onPress={handleLike}>Like</Button>;
}
```

## Cache Strategies

| Strategy | staleTime | gcTime | Use Case |
|----------|-----------|--------|----------|
| REALTIME | 0 | 5 min | Live data (chat, scores) |
| USER_DATA | 30 min | 24 hours | User profile, settings |
| MASTER_DATA | 24 hours | 7 days | Countries, categories |
| PUBLIC_DATA | 30 min | 24 hours | Feed, blog posts |

## API Reference

See [TypeScript definitions](./src/index.ts) for complete API documentation.

## License

MIT © Ümit UZ
