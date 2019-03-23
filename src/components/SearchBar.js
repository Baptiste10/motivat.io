import SearchBar from 'material-ui-search-bar'

class SearchBar extends React.Component {
    render() {
        return(
        <SearchBar
            onChange={() => console.log('onChange')}
            onRequestSearch={() => console.log('onRequestSearch')}
            style={{
            margin: '0 auto',
            maxWidth: 800
            }}
        />
        )
    }
}
