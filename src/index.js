import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'

const VALID_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

class Directions extends PureComponent {
  directions = null

  componentDidMount() {
    this.initializeDirections()
  }
  componentWillUnmount() {
    this.removeDirections()
  }

  componentDidUpdate() {
    this.removeDirections()
    this.initializeDirections()
  }

  initializeDirections = () => {
    const mapboxMap = this.getMapboxMap()
    const {
      mapboxApiAccessToken,
      position,
      styles,
      api,
      interactive,
      profile,
      alternatives,
      congestion,
      unit,
      compile,
      geocoder,
      controls,
      zoom,
      placeholderOrigin,
      placeholderDestination,
      flyTo,
      exclude,
      onInit,
    } = this.props

    const options = {
      accessToken: mapboxApiAccessToken,
      styles,
      api,
      interactive,
      profile,
      alternatives,
      congestion,
      unit,
      geocoder,
      controls,
      zoom,
      placeholderOrigin,
      placeholderDestination,
      flyTo,
      exclude,
    }

    if (compile && typeof compile === 'function') {
      options.compile = compile
    }

    this.directions = new MapboxDirections(options)
    this.subscribeEvents()

    mapboxMap.addControl(
      this.directions,
      VALID_POSITIONS.find((_position) => position === _position)
    )

    onInit(this.directions)
  }

  getMapboxMap = () => {
    const { mapRef } = this.props
    return (mapRef && mapRef.current && mapRef.current.getMap()) || null
  }

  subscribeEvents = () => {
    this.directions.on('clear', this.handleClear)
    this.directions.on('loading', this.handleLoading)
    this.directions.on('profile', this.handleProfile)
    this.directions.on('origin', this.handleOrigin)
    this.directions.on('destination', this.handleDestination)
    this.directions.on('route', this.handleRoute)
    this.directions.on('error', this.handleError)
  }
  unsubscribeEvents = () => {
    this.directions.off('clear', this.handleClear)
    this.directions.off('loading', this.handleLoading)
    this.directions.off('profile', this.handleProfile)
    this.directions.off('origin', this.handleOrigin)
    this.directions.off('destination', this.handleDestination)
    this.directions.off('route', this.handleRoute)
    this.directions.off('error', this.handleError)
  }

  removeDirections = () => {
    const mapboxMap = this.getMapboxMap()

    this.unsubscribeEvents()
    if (mapboxMap && mapboxMap.removeControl) {
      this.getMapboxMap().removeControl(this.directions)
    }

    this.directions = null
  }

  handleClear = (event) => {
    this.props.onClear(event)
  }
  handleLoading = (event) => {
    this.props.onLoading(event)
  }
  handleProfile = (event) => {
    this.props.onProfile(event)
  }
  handleOrigin = (event) => {
    this.props.onOrigin(event)
  }
  handleDestination = (event) => {
    this.props.onDestination(event)
  }
  handleRoute = (event) => {
    this.props.onRoute(event)
  }
  handleError = (event) => {
    this.props.onError(event)
  }

  render() {
    return null
  }

  static propTypes = {
    mapRef: PropTypes.object.isRequired,
    mapboxApiAccessToken: PropTypes.string.isRequired,
    position: PropTypes.oneOf(VALID_POSITIONS),
    styles: PropTypes.array,
    api: PropTypes.string,
    interactive: PropTypes.bool,
    profile: PropTypes.string,
    alternatives: PropTypes.bool,
    congestion: PropTypes.bool,
    unit: PropTypes.string,
    compile: PropTypes.func,
    geocoder: PropTypes.object,
    controls: PropTypes.object,
    zoom: PropTypes.number,
    placeholderOrigin: PropTypes.string,
    placeholderDestination: PropTypes.string,
    flyTo: PropTypes.bool,
    exclude: PropTypes.bool,
    onInit: PropTypes.func,
    onClear: PropTypes.func,
    onLoading: PropTypes.func,
    onOrigin: PropTypes.func,
    onProfile: PropTypes.func,
    onDestination: PropTypes.func,
    onRoute: PropTypes.func,
    onError: PropTypes.func,
  }

  static defaultProps = {
    position: 'top-right',
    zoom: 16,
    api: 'https://api.mapbox.com/directions/v5/',
    profile: 'mapbox/driving-traffic',
    onInit: () => {},
    onClear: () => {},
    onLoading: () => {},
    onOrigin: () => {},
    onProfile: () => {},
    onDestination: () => {},
    onRoute: () => {},
    onError: () => {},
  }
}
export default Directions
