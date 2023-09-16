import { useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useAppDisPatch, useAppSelector } from '../redux/store'
import Important from './Important'
import Lists from './Lists'
import MyDay from './MyDay'
import { listActions } from '../redux/listSlices'

const Dashboard = () => {
  const { lists } = useAppSelector((state) => state.list)

  const [showAddInput, setshowAddInput] = useState(false)
  const [listTitle, setlistTitle] = useState('')
  const [sideClass, setsideClass] = useState<'sidebar' | 'mobileSidebar'>(
    'sidebar'
  )
  const dispatch = useAppDisPatch()

  const toggleNav = () => {
    setsideClass((prev) => (prev === 'sidebar' ? 'mobileSidebar' : 'sidebar'))
  }

  const addNewList = (e: any) => {
    e.preventDefault()
    if (!listTitle) return
    dispatch(
      listActions.createList({
        id: Math.random().toString(),
        title: listTitle,
        is_main: false,
        tasks: [],
      })
    )
    setlistTitle('')
  }

  const location = useLocation()

  const [activeList, setactiveList] = useState<number>(0)

  const deleteList = (id: string, index: number) => {
    dispatch(listActions.deleteList(id))

    if (index === activeList) setactiveList((prev) => prev - 1)
  }

  return (
    <div>
      <div className='navbar'>
        <div className='navbar_content'>
          <h3>
            Task-it - <span>Task management tool</span>
          </h3>
          <button className='sidebar_toggle' onClick={toggleNav}>
            <i className='fa-solid fa-bars'></i>
          </button>
        </div>
      </div>
      <div className='main'>
        <aside className={sideClass}>
          <button className='sidebar_close' onClick={toggleNav}>
            x
          </button>
          <div className='sidebar_top'>
            <div className='sidebar_top-links'>
              <Link to='/myday'>
                <i className='fa-regular fa-sun'></i> My Day
              </Link>
              <Link to='/important'>
                <i className='fa-regular fa-star'></i> Imoportant
              </Link>
              <Link to='/'>
                <i className='fa-solid fa-house'></i>Lists
              </Link>
            </div>
            {location.pathname === '/' && (
              <div className='sidebar_top-lists'>
                {lists.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setactiveList(index)}
                    className='listLink'>
                    {item.title}
                    {!item.is_main && (
                      <button onClick={() => deleteList(item.id, index)}>
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='sidebar_bottom'>
            {showAddInput ? (
              <div className='add_new'>
                <span>
                  <button onClick={() => setshowAddInput(false)}>Cancel</button>
                </span>
                <form onSubmit={addNewList}>
                  <input
                    type='text'
                    placeholder='Add new Task'
                    value={listTitle}
                    onChange={(e) => setlistTitle(e.target.value)}
                  />
                  <button type='submit'>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </form>
              </div>
            ) : (
              <button
                className='addList_btn'
                onClick={() => setshowAddInput(true)}>
                <i className='fa-solid fa-plus'></i>
                Add new list
              </button>
            )}
          </div>
        </aside>
        <main className='main_content'>
          <Routes>
            <Route index element={<Lists data={lists[activeList]} />} />
            <Route path='/important' element={<Important />} />
            <Route path='/myday' element={<MyDay />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
