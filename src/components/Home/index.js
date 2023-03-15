import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    category: 'ALL',
    itemsList: [],
    activeStatus: apiStatus.initial,
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({activeStatus: apiStatus.progress})
    const {category} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState(prevState => ({
        itemsList: [formattedData],
        activeStatus: apiStatus.success,
      }))
    } else {
      this.setState({activeStatus: apiStatus.failure})
    }
  }

  onSelectClick = event => {
    this.setState({category: event.target.value.toUpperCase()}, this.getDetails)
  }

  renderSuccess = () => {
    const {itemsList, category} = this.state
    console.log(category)
    return (
      <div>
        {itemsList.map(each =>
          each.map(every => (
            <li className="list-item" key={every.id}>
              <div>
                <img src={every.imageUrl} alt={every.name} />
                <p>{every.name}</p>
              </div>
            </li>
          )),
        )}
      </div>
    )
  }

  renderFailure = () => {
    const retryClick = () => {
      this.renderSuccess()
    }
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
        />
        <h1>Oops!Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={retryClick}>
          Retry
        </button>
      </div>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="black" height={50} width={50} />
    </div>
  )

  renderItem = () => {
    const {activeStatus} = this.state

    switch (activeStatus) {
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.failure:
        return this.renderFailure()
      case apiStatus.progress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="project-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <select className="select-container" onChange={this.onSelectClick}>
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        <ul className="projects-container">{this.renderItem()}</ul>
      </div>
    )
  }
}
export default Home
