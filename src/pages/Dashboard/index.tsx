import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type food = {
  available: boolean
  image: string
  id: number
  name: string
  price: string
  description: string
}

export default function Dashboard(){
  const [foods, setFoods] = useState<food[]>([])
  const [editingFood, setEditingFood] = useState<food>({} as food)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, seteditModalOpen] = useState(false)

  useEffect(()=>{
    async function getFood(){
      const response = await api.get('/foods')
      setFoods(response.data)
    }

    getFood()
  }, [])

  async function handleAddFood(food: food){

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      return setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: food){
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number){

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal(){
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(){

    seteditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: food){
    setEditingFood(food);
    seteditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}