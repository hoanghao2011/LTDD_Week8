import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';

export default function MasterScreen({ navigation }) {
  const [donuts, setDonuts] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredDonuts, setFilteredDonuts] = useState([]);

  useEffect(() => {
    fetchDonuts();
  }, []);

  const fetchDonuts = () => {
    axios
      .get('https://670fdb9da85f4164ef2c393a.mockapi.io/donut')
      .then(response => {
        console.log(response.data); // Kiểm tra dữ liệu đã lấy
        setDonuts(response.data);
        setFilteredDonuts(response.data); // Đặt danh sách ban đầu cho filteredDonuts
      })
      .catch(error => console.error('Lỗi khi lấy donuts:', error));
  };

  const handleFilter = (category) => {
    if (category) {
      const filtered = donuts.filter(donut => donut.type === category);
      setFilteredDonuts(filtered);
    } else {
      setFilteredDonuts(donuts); // Nếu không có bộ lọc, hiển thị tất cả
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search food"
        value={filter}
        onChangeText={text => {
          setFilter(text);
          const filtered = donuts.filter(donut => donut.name.toLowerCase().includes(text.toLowerCase()));
          setFilteredDonuts(filtered);
        }}
      />
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => handleFilter('tasty')}>
          <Text>Tasty</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('pink')}>
          <Text>Pink</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('floating')}>
          <Text>Floating</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('')}> {/* Thêm nút để hiển thị tất cả */}
          <Text>All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredDonuts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { item })}>
            <View style={styles.donutItem}>
              <Image source={{ uri: item.image }} style={styles.donutImage} />
              <Text>{item.name}</Text>
              <Text>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  donutItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  donutImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});
