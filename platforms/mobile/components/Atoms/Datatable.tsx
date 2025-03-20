import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from '@tanstack/react-table'


interface propsType<T> {
    columns: ColumnDef<T, any>[],
    data: T[]
}

export default function Datatable<T>({ columns, data } : propsType<T>) {


    const table = useReactTable({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
    })

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <Text key={header.id} style={styles.headerText}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </Text>
          ))
        )}
      </View>

      {/* Body */}
      <FlatList
        data={table.getRowModel().rows}
        keyExtractor={(row) => row.id}
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.getVisibleCells().map((cell) => (
              <Text key={cell.id} style={styles.cell}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      margin: 10,
      borderWidth: 1,
      borderColor: "#ccc",
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: "#ddd",
      padding: 10,
    },
    headerText: {
      flex: 1,
      fontWeight: "bold",
      textAlign: "center",
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      padding: 10,
    },
    cell: {
      flex: 1,
      textAlign: "center",
    },
  });