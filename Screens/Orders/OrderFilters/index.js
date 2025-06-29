"use client"

import React, { useState, useCallback, useEffect } from "react"
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Switch, Animated } from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faTimes, faCalendar, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useDispatch } from "react-redux"
import { getCategories } from "../../../context/actions/category"

const OrderFilters = ({ filters, onFiltersChange, visible, onClose }) => {
  const dispatch = useDispatch()
  const [localFilters, setLocalFilters] = useState(filters)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [slideAnim] = useState(new Animated.Value(0))
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  // Fetch categories when modal opens
  useEffect(() => {
    if (visible && categories.length === 0) {
      fetchCategories()
    }
  }, [visible])

  const fetchCategories = useCallback(() => {
    setCategoriesLoading(true)
    dispatch(
      getCategories({}, (response) => {
        if (response?.docs) {
          setCategories(response.docs)
        } else if (response && Array.isArray(response)) {
          setCategories(response)
        }
        setCategoriesLoading(false)
      })
    )
  }, [dispatch])

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start()
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start()
    }
  }, [visible])

  const orderStatusOptions = [
    { label: "All Status", value: "", color: null },
    { label: "Received", value: "Received", color: "#4A90E2", lightColor: "#E3F2FD" },
    { label: "Preparing", value: "Preparing", color: "#F5A623", lightColor: "#FFF8E1" },
    { label: "Complete", value: "Complete", color: "#7ED321", lightColor: "#F1F8E9" },
    { label: "Collected", value: "Collected", color: "#50E3C2", lightColor: "#E0F2F1" },
    { label: "Cancel", value: "Cancel", color: "#D0021B", lightColor: "#FFEBEE" },
  ]

  const handleFilterChange = useCallback((key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const handleApplyFilters = useCallback(() => {
    onFiltersChange(localFilters)
    onClose()
  }, [localFilters, onFiltersChange, onClose])

  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      search: filters.search, // Keep search as it's handled on main page
      orderStatus: "",
      foodCategory: "",
      orderCompleted: undefined,
      orderCanceled: undefined,
      paymentSuccess: undefined,
      startDate: null,
      endDate: null,
    }
    setLocalFilters(resetFilters)
  }, [filters.search])

  const formatDate = (date) => {
    if (!date) return "Select Date"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false)
    if (selectedDate) {
      handleFilterChange("startDate", selectedDate)
    }
  }

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false)
    if (selectedDate) {
      handleFilterChange("endDate", selectedDate)
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.orderStatus) count++
    if (localFilters.foodCategory) count++
    if (localFilters.orderCompleted !== undefined) count++
    if (localFilters.orderCanceled !== undefined) count++
    if (localFilters.paymentSuccess !== undefined) count++
    if (localFilters.startDate) count++
    if (localFilters.endDate) count++
    return count
  }

  const getSelectedStatusOption = () => {
    return orderStatusOptions.find(option => option.value === localFilters.orderStatus)
  }

  const getSelectedCategory = () => {
    return categories.find(category => category._id === localFilters.foodCategory)
  }

  return (
    <Modal visible={visible} animationType="none" transparent={true} onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Filters</Text>
              {getActiveFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                </View>
              )}
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#666" />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Order Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Status</Text>
              <View style={styles.statusGrid}>
                {orderStatusOptions.map((option) => {
                  const isSelected = localFilters.orderStatus === option.value
                  return (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.statusChip,
                        isSelected && styles.statusChipSelected,
                        isSelected && option.lightColor && { backgroundColor: option.lightColor },
                      ]}
                      onPress={() => handleFilterChange("orderStatus", option.value)}
                    >
                      {option.color && (
                        <View style={[styles.statusDot, { backgroundColor: option.color }]} />
                      )}
                      <Text
                        style={[
                          styles.statusChipText,
                          isSelected && styles.statusChipTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkIconContainer}>
                          <FontAwesomeIcon icon={faCheck} size={12} color="#FFC300" />
                        </View>
                      )}
                    </Pressable>
                  )
                })}
              </View>
            </View>

            {/* Food Category */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Food Category</Text>
                {categoriesLoading && (
                  <FontAwesomeIcon icon={faSpinner} size={16} color="#FFC300" />
                )}
              </View>
              
              <View style={styles.categoryGrid}>
                <Pressable
                  style={[
                    styles.categoryChip,
                    !localFilters.foodCategory && styles.categoryChipSelected,
                    !localFilters.foodCategory && { backgroundColor: "#FFF8E1" },
                  ]}
                  onPress={() => handleFilterChange("foodCategory", "")}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      !localFilters.foodCategory && styles.categoryChipTextSelected,
                    ]}
                  >
                    All Categories
                  </Text>
                  {!localFilters.foodCategory && (
                    <View style={styles.checkIconContainer}>
                      <FontAwesomeIcon icon={faCheck} size={12} color="#FFC300" />
                    </View>
                  )}
                </Pressable>
                
                {categories.map((category) => {
                  const isSelected = localFilters.foodCategory === category._id
                  return (
                    <Pressable
                      key={category._id}
                      style={[
                        styles.categoryChip,
                        isSelected && styles.categoryChipSelected,
                        isSelected && { backgroundColor: "#FFF8E1" },
                      ]}
                      onPress={() => handleFilterChange("foodCategory", category._id)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkIconContainer}>
                          <FontAwesomeIcon icon={faCheck} size={12} color="#FFC300" />
                        </View>
                      )}
                    </Pressable>
                  )
                })}
              </View>
              
              {categories.length === 0 && !categoriesLoading && (
                <Pressable style={styles.retryButton} onPress={fetchCategories}>
                  <Text style={styles.retryButtonText}>Retry Loading Categories</Text>
                </Pressable>
              )}
            </View>

            {/* Date Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              <View style={styles.dateContainer}>
                <Pressable
                  style={[
                    styles.dateButton,
                    localFilters.startDate && styles.dateButtonSelected,
                    localFilters.startDate && { backgroundColor: "#FFF8E1" },
                  ]}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <FontAwesomeIcon
                    icon={faCalendar}
                    size={16}
                    color={localFilters.startDate ? "#FFC300" : "#666"}
                    style={styles.dateIcon}
                  />
                  <Text style={[styles.dateText, localFilters.startDate && styles.dateTextSelected]}>
                    From: {formatDate(localFilters.startDate)}
                  </Text>
                  {localFilters.startDate && (
                    <View style={styles.checkIconContainer}>
                      <FontAwesomeIcon icon={faCheck} size={12} color="#FFC300" />
                    </View>
                  )}
                </Pressable>
                
                <Pressable
                  style={[
                    styles.dateButton,
                    localFilters.endDate && styles.dateButtonSelected,
                    localFilters.endDate && { backgroundColor: "#FFF8E1" },
                  ]}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <FontAwesomeIcon
                    icon={faCalendar}
                    size={16}
                    color={localFilters.endDate ? "#FFC300" : "#666"}
                    style={styles.dateIcon}
                  />
                  <Text style={[styles.dateText, localFilters.endDate && styles.dateTextSelected]}>
                    To: {formatDate(localFilters.endDate)}
                  </Text>
                  {localFilters.endDate && (
                    <View style={styles.checkIconContainer}>
                      <FontAwesomeIcon icon={faCheck} size={12} color="#FFC300" />
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Quick Filters */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Filters</Text>

              <View style={styles.switchContainer}>
                <View style={[
                  styles.switchRow,
                  localFilters.orderCompleted === true && styles.switchRowSelected
                ]}>
                  <View style={styles.switchInfo}>
                    <Text style={styles.switchLabel}>Completed Orders</Text>
                    <Text style={styles.switchDescription}>Show only completed orders</Text>
                  </View>
                  <Switch
                    value={localFilters.orderCompleted === true}
                    onValueChange={(value) => handleFilterChange("orderCompleted", value ? true : undefined)}
                    trackColor={{ false: "#E5E5E5", true: "#FFC300" }}
                    thumbColor={localFilters.orderCompleted === true ? "#fff" : "#f4f3f4"}
                    ios_backgroundColor="#E5E5E5"
                  />
                </View>

                <View style={[
                  styles.switchRow,
                  localFilters.orderCanceled === true && styles.switchRowSelected
                ]}>
                  <View style={styles.switchInfo}>
                    <Text style={styles.switchLabel}>Canceled Orders</Text>
                    <Text style={styles.switchDescription}>Show only canceled orders</Text>
                  </View>
                  <Switch
                    value={localFilters.orderCanceled === true}
                    onValueChange={(value) => handleFilterChange("orderCanceled", value ? true : undefined)}
                    trackColor={{ false: "#E5E5E5", true: "#FFC300" }}
                    thumbColor={localFilters.orderCanceled === true ? "#fff" : "#f4f3f4"}
                    ios_backgroundColor="#E5E5E5"
                  />
                </View>

                <View style={[
                  styles.switchRow,
                  localFilters.paymentSuccess === true && styles.switchRowSelected
                ]}>
                  <View style={styles.switchInfo}>
                    <Text style={styles.switchLabel}>Successful Payments</Text>
                    <Text style={styles.switchDescription}>Show only paid orders</Text>
                  </View>
                  <Switch
                    value={localFilters.paymentSuccess === true}
                    onValueChange={(value) => handleFilterChange("paymentSuccess", value ? true : undefined)}
                    trackColor={{ false: "#E5E5E5", true: "#FFC300" }}
                    thumbColor={localFilters.paymentSuccess === true ? "#fff" : "#f4f3f4"}
                    ios_backgroundColor="#E5E5E5"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <Pressable style={styles.resetButton} onPress={handleResetFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>
                Apply {getActiveFiltersCount() > 0 ? `(${getActiveFiltersCount()})` : ""}
              </Text>
            </Pressable>
          </View>

          {/* Date Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={localFilters.startDate || new Date()}
              mode="date"
              display="default"
              onChange={onStartDateChange}
              maximumDate={new Date()}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={localFilters.endDate || new Date()}
              mode="date"
              display="default"
              onChange={onEndDateChange}
              maximumDate={new Date()}
              minimumDate={localFilters.startDate}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    minHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
  filterBadge: {
    backgroundColor: "#FFC300",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    gap: 8,
    minHeight: 44,
  },
  statusChipSelected: {
    borderColor: "#FFC300",
    borderWidth: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusChipText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  statusChipTextSelected: {
    color: "#333",
    fontWeight: "600",
  },
  checkIconContainer: {
    marginLeft: 4,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    gap: 8,
    minHeight: 44,
  },
  categoryChipSelected: {
    borderColor: "#FFC300",
    borderWidth: 2,
  },
  categoryChipText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  categoryChipTextSelected: {
    color: "#333",
    fontWeight: "600",
  },
  dateContainer: {
    gap: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    minHeight: 50,
  },
  dateButtonSelected: {
    borderColor: "#FFC300",
    borderWidth: 2,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    fontFamily: "Poppins-Medium",
  },
  dateTextSelected: {
    color: "#333",
    fontWeight: "600",
  },
  switchContainer: {
    gap: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
  },
  switchRowSelected: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FFC300",
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#F8F9FA",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#FFC300",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFC300",
    alignItems: "center",
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: "#B8860B",
    fontFamily: "Poppins-Medium",
  },
})

export default OrderFilters
