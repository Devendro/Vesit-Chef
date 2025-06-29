"use client"

import { useEffect, useState, useContext, useCallback, useMemo, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  RefreshControl,
  Alert,
  Pressable,
  TextInput,
  Animated,
  Dimensions,
  Keyboard,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faFilter, faSearch, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons"

import Header from "../../components/Header"
import OrderCard from "./OrderCard"
import UnloadedOrderedCard from "../../components/UnloadedOrderedCard"
import OrderFilters from "./OrderFilters"
import { getALlOrders, updateOrderStatus } from "../../context/actions/order"
import { SocketContext } from "../../context/actions/socket"

const { width } = Dimensions.get("window")

// Enhanced Empty State Component
const EmptyOrdersState = ({ hasFilters, hasSearch, onClearFilters, searchQuery }) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyStateIcon}>
      <FontAwesomeIcon icon={faSearch} size={48} color="#E5E5E5" />
    </View>
    <Text style={styles.emptyStateTitle}>
      {hasSearch
        ? `No orders found for "${searchQuery}"`
        : hasFilters
          ? "No Orders Match Your Filters"
          : "No Orders Found"}
    </Text>
    <Text style={styles.emptyStateText}>
      {hasSearch
        ? "Try searching with a different order ID"
        : hasFilters
          ? "Try adjusting your filters to see more results."
          : "Your order history will appear here once you place your first order."}
    </Text>
    {(hasFilters || hasSearch) && (
      <Pressable style={styles.clearFiltersButton} onPress={onClearFilters}>
        <Text style={styles.clearFiltersButtonText}>{hasSearch ? "Clear Search" : "Clear Filters"}</Text>
      </Pressable>
    )}
  </View>
)

// Enhanced Error State Component
const ErrorState = ({ onRetry }) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyStateIcon}>
      <FontAwesomeIcon icon={faSpinner} size={48} color="#E5E5E5" />
    </View>
    <Text style={styles.emptyStateTitle}>Something went wrong</Text>
    <Text style={styles.emptyStateText}>Unable to load orders. Please try again.</Text>
    <Pressable style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </Pressable>
  </View>
)

// Enhanced Loading Skeleton
const LoadingSkeleton = () => (
  <View style={styles.orderContainer}>
    {Array.from({ length: 4 }, (_, index) => (
      <View key={index} style={styles.skeletonWrapper}>
        <UnloadedOrderedCard />
      </View>
    ))}
  </View>
)

// Enhanced Search Bar Component with Search Button
const SearchBar = ({ searchQuery, onSearchChange, onSearch, onClearSearch, isSearching }) => {
  const [isFocused, setIsFocused] = useState(false)
  const searchInputRef = useRef(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isFocused || searchQuery ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [isFocused, searchQuery])

  const handleSearchPress = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
      Keyboard.dismiss()
    }
  }

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === "Enter") {
      handleSearchPress()
    }
  }

  return (
    <View style={styles.searchContainer}>
      <View style={[styles.searchInputContainer, isFocused && styles.searchInputFocused]}>
        <FontAwesomeIcon
          icon={faSearch}
          size={16}
          color={isFocused || searchQuery ? "#FFC300" : "#999"}
          style={styles.searchIcon}
        />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search by Order ID..."
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSearchPress}
          onKeyPress={handleKeyPress}
          placeholderTextColor="#999"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Pressable onPress={onClearSearch} style={styles.clearSearchButton}>
              <FontAwesomeIcon icon={faTimes} size={14} color="#666" />
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Search Button */}
      <Pressable
        style={[styles.searchButton, (!searchQuery.trim() || isSearching) && styles.searchButtonDisabled]}
        onPress={handleSearchPress}
        disabled={!searchQuery.trim() || isSearching}
      >
        {isSearching ? (
          <FontAwesomeIcon icon={faSpinner} size={16} color="#333" />
        ) : (
          <Text style={styles.searchButtonText}>Search</Text>
        )}
      </Pressable>
    </View>
  )
}

// Enhanced Filter Summary Component
const FilterSummary = ({ filters, totalResults, onClearFilters, onShowFilters }) => {
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.orderStatus) count++
    if (filters.foodCategory) count++
    if (filters.orderCompleted !== undefined) count++
    if (filters.orderCanceled !== undefined) count++
    if (filters.paymentSuccess !== undefined) count++
    if (filters.startDate) count++
    if (filters.endDate) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()
  const hasActiveFilters = activeFiltersCount > 0

  if (!hasActiveFilters && !filters.search) return null

  return (
    <Animated.View
      style={styles.filterSummaryContainer}
      entering={() => ({
        opacity: 0,
        transform: [{ translateY: -20 }],
      })}
      animate={{
        opacity: 1,
        transform: [{ translateY: 0 }],
      }}
    >
      <View style={styles.filterSummaryLeft}>
        <Text style={styles.filterSummaryText}>
          {totalResults} result{totalResults !== 1 ? "s" : ""}
          {hasActiveFilters && ` • ${activeFiltersCount} filter${activeFiltersCount !== 1 ? "s" : ""}`}
          {filters.search && ` • "${filters.search}"`}
        </Text>
      </View>
      <View style={styles.filterSummaryRight}>
        {hasActiveFilters && (
          <Pressable onPress={onShowFilters} style={styles.editFiltersButton}>
            <Text style={styles.editFiltersText}>Edit</Text>
          </Pressable>
        )}
        <Pressable onPress={onClearFilters} style={styles.clearAllButton}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </Pressable>
      </View>
    </Animated.View>
  )
}

const Orders = () => {
  const { backendSocket } = useContext(SocketContext)
  const dispatch = useDispatch()
  const navigation = useNavigation()

  // Redux selectors
  const isLoggedIn = useSelector((state) => state?.user?.loggedIn)

  // Local state
  const [orders, setOrders] = useState({ docs: [], totalDocs: 0 })
  const [orderLoading, setOrderLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [updatingOrders, setUpdatingOrders] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    orderStatus: "",
    foodCategory: "",
    orderCompleted: undefined,
    orderCanceled: undefined,
    paymentSuccess: undefined,
    startDate: null,
    endDate: null,
  })

  // Authentication check
  useEffect(() => {
    if (!isLoggedIn) {
      navigation.replace("Login")
    }
  }, [isLoggedIn, navigation])

  // Handle search input change (no auto-search)
  const handleSearchChange = useCallback((text) => {
    setSearchQuery(text)
  }, [])

  // Handle search button press
  const handleSearch = useCallback((query) => {
    setIsSearching(true)
    setFilters((prev) => ({ ...prev, search: query }))

    // Clear searching state after a short delay
    setTimeout(() => {
      setIsSearching(false)
    }, 1000)
  }, [])

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
    setFilters((prev) => ({ ...prev, search: "" }))
    setIsSearching(false)
    Keyboard.dismiss()
  }, [])

  // Build query parameters from filters
  const buildQueryParams = useCallback(
    (page = 1) => {
      const params = {
        page,
        limit: 10,
      }

      // Add filters to params
      if (filters.search) params.search = filters.search
      if (filters.orderStatus) params.orderStatus = filters.orderStatus
      if (filters.foodCategory) params.foodCategory = filters.foodCategory
      if (filters.orderCompleted !== undefined) params.orderCompleted = filters.orderCompleted
      if (filters.orderCanceled !== undefined) params.orderCanceled = filters.orderCanceled
      if (filters.paymentSuccess !== undefined) params.paymentSuccess = filters.paymentSuccess
      if (filters.startDate) params.startDate = filters.startDate.toISOString()
      if (filters.endDate) params.endDate = filters.endDate.toISOString()

      return params
    },
    [filters],
  )

  // Fetch orders function
  const fetchOrders = useCallback(
    async (page = 1, isRefresh = false, isLoadMore = false) => {
      try {
        if (!isRefresh && !isLoadMore) {
          setOrderLoading(true)
        }
        if (isLoadMore) {
          setLoadingMore(true)
        }
        setError(null)

        const queryParams = buildQueryParams(page)

        const response = await new Promise((resolve, reject) => {
          dispatch(
            getALlOrders(queryParams, (res) => {
              if (res?.error) {
                reject(new Error(res.error))
              } else {
                resolve(res)
              }
            }),
          )
        })

        const newOrders = response || { docs: [], totalDocs: 0 }

        if (isLoadMore && page > 1) {
          // Append new orders for pagination
          setOrders((prev) => ({
            ...newOrders,
            docs: [...prev.docs, ...newOrders.docs],
          }))
        } else {
          // Replace orders for refresh or initial load
          setOrders(newOrders)
          setCurrentPage(1)
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        setError(err.message || "Failed to load orders")
      } finally {
        setOrderLoading(false)
        setLoadingMore(false)
        if (isRefresh) {
          setRefreshing(false)
        }
      }
    },
    [dispatch, buildQueryParams],
  )

  // Initial load and focus refresh
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        fetchOrders(1)
      }
    }, [isLoggedIn, fetchOrders]),
  )

  // Refetch when filters change
  useEffect(() => {
    if (isLoggedIn) {
      setCurrentPage(1)
      fetchOrders(1)
    }
  }, [filters, isLoggedIn, fetchOrders])

  // Socket event handler
  const handleOrderStatusUpdate = useCallback((socketData) => {
    if (!socketData?.mainOrderId || !socketData?.orderId) {
      console.warn("Invalid socket data received:", socketData)
      return
    }

    setOrders((prevOrders) => {
      const updatedDocs = prevOrders?.docs?.map((mainOrder) => {
        if (mainOrder._id === socketData.mainOrderId) {
          const updatedOrder = {
            ...mainOrder,
            order: mainOrder.order?.map((order) => {
              if (order._id === socketData.orderId) {
                return {
                  ...order,
                  orderStatus: socketData.orderStatus,
                }
              }
              return order
            }),
          }
          return updatedOrder
        }
        return mainOrder
      })

      return {
        ...prevOrders,
        docs: updatedDocs || [],
      }
    })
  }, [])

  // Socket setup and cleanup
  useEffect(() => {
    if (!backendSocket || !isLoggedIn) return

    const handleSocketUpdate = (res, err) => {
      if (err) {
        console.error("Socket error:", err)
        return
      }
      handleOrderStatusUpdate(res)
    }

    backendSocket.off("orderStatusUpdate")
    backendSocket.on("orderStatusUpdate", handleSocketUpdate)

    return () => {
      backendSocket.off("orderStatusUpdate", handleSocketUpdate)
    }
  }, [backendSocket, isLoggedIn, handleOrderStatusUpdate])

  // Pull to refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setCurrentPage(1)
    fetchOrders(1, true)
  }, [fetchOrders])

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && orders.docs.length < orders.totalDocs) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchOrders(nextPage, false, true)
    }
  }, [loadingMore, orders.docs.length, orders.totalDocs, currentPage, fetchOrders])

  // Filter handlers
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setShowFilters(false)
  }, [])

  const handleClearAllFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      orderStatus: "",
      foodCategory: "",
      orderCompleted: undefined,
      orderCanceled: undefined,
      paymentSuccess: undefined,
      startDate: null,
      endDate: null,
    }
    setFilters(clearedFilters)
    setSearchQuery("")
    setIsSearching(false)
  }, [])

  // Order status update handler
  const handleUpdateOrderStatus = useCallback(
    async (orderId, status, completed = false) => {
      if (updatingOrders.has(orderId)) {
        return
      }

      Alert.alert("Update Order Status", `Are you sure you want to mark this order as ${status}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            try {
              setUpdatingOrders((prev) => new Set(prev).add(orderId))

              await new Promise((resolve, reject) => {
                dispatch(
                  updateOrderStatus({ orderId, newStatus: status, completed }, (response) => {
                    if (response?.error) {
                      reject(new Error(response.error))
                    } else {
                      resolve(response)
                    }
                  }),
                )
              })

              // Refresh current page after successful update
              fetchOrders(1, true)
            } catch (error) {
              console.error("Failed to update order status:", error)
              Alert.alert("Update Failed", "Failed to update order status. Please try again.")
            } finally {
              setUpdatingOrders((prev) => {
                const newSet = new Set(prev)
                newSet.delete(orderId)
                return newSet
              })
            }
          },
        },
      ])
    },
    [dispatch, fetchOrders, updatingOrders],
  )

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.orderStatus ||
      filters.foodCategory ||
      filters.orderCompleted !== undefined ||
      filters.orderCanceled !== undefined ||
      filters.paymentSuccess !== undefined ||
      filters.startDate ||
      filters.endDate
    )
  }, [filters])

  const hasSearch = useMemo(() => {
    return filters.search
  }, [filters.search])

  // Memoized render item
  const renderOrderItem = useCallback(
    ({ item, index }) => (
      <Animated.View
        style={[
          styles.orderItemWrapper,
          {
            opacity: 1,
            transform: [{ translateY: 0 }],
          },
        ]}
      >
        <OrderCard
          foodData={item}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
          isUpdating={item.order?.some((order) => updatingOrders.has(order._id))}
        />
      </Animated.View>
    ),
    [handleUpdateOrderStatus, updatingOrders],
  )

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item?._id?.toString(), [])

  // Memoized refresh control
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={["#FFC300"]}
        tintColor="#FFC300"
        title="Pull to refresh"
        titleColor="#666"
        progressBackgroundColor="#fff"
      />
    ),
    [refreshing, handleRefresh],
  )

  // Render footer for load more
  const renderFooter = useCallback(() => {
    if (!loadingMore) return <View style={styles.listFooter} />
    return (
      <View style={styles.loadMoreContainer}>
        <UnloadedOrderedCard />
      </View>
    )
  }, [loadingMore])

  // Early return for unauthenticated users
  if (!isLoggedIn) {
    return null
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Header title="Order History" />
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setShowFilters(true)}
          >
            <FontAwesomeIcon icon={faFilter} size={16} color={hasActiveFilters ? "#333" : "#666"} />
            {hasActiveFilters && <View style={styles.filterIndicator} />}
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        isSearching={isSearching}
      />

      {/* Filter Summary */}
      <FilterSummary
        filters={filters}
        totalResults={orders.totalDocs}
        onClearFilters={handleClearAllFilters}
        onShowFilters={() => setShowFilters(true)}
      />

      {/* Content */}
      {orderLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState onRetry={() => fetchOrders(1)} />
      ) : !orders?.docs?.length ? (
        <EmptyOrdersState
          hasFilters={hasActiveFilters}
          hasSearch={hasSearch}
          searchQuery={filters.search}
          onClearFilters={handleClearAllFilters}
        />
      ) : (
        <FlatList
          style={styles.orderContainer}
          data={orders.docs}
          renderItem={renderOrderItem}
          keyExtractor={keyExtractor}
          refreshControl={refreshControl}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={10}
          initialNumToRender={3}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      )}

      {/* Filter Modal */}
      <OrderFilters
        visible={showFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClose={() => setShowFilters(false)}
      />
    </View>
  )
}

export default Orders

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 8,
  },
  headerActions: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  filterButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: "#FFC300",
    borderColor: "#FFC300",
  },
  filterIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  searchInputFocused: {
    borderColor: "#FFC300",
    backgroundColor: "#FFFBF0",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
  clearSearchButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#E5E5E5",
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFC300",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  searchButtonDisabled: {
    backgroundColor: "#E5E5E5",
    opacity: 0.6,
  },
  searchButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
  filterSummaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF8E1",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  filterSummaryLeft: {
    flex: 1,
  },
  filterSummaryText: {
    fontSize: 14,
    color: "#B8860B",
    fontFamily: "Poppins-Medium",
  },
  filterSummaryRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FFC300",
  },
  editFiltersText: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 13,
    color: "#B8860B",
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
  },
  orderContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
  },
  listFooter: {
    height: 32,
  },
  orderItemWrapper: {
    marginBottom: 12,
  },
  itemSeparator: {
    height: 8,
  },
  loadMoreContainer: {
    paddingVertical: 16,
  },
  skeletonWrapper: {
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: "Poppins-Regular",
  },
  clearFiltersButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#FFC300",
    borderRadius: 12,
  },
  clearFiltersButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#FFC300",
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
})
