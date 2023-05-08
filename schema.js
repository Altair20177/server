const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type User{
        id: ID
        age: Int
        name: String
        surname: String
        passport: String
        email: String
        password: String
        wallet: Wallet
    }

    type UsersTopCrypts{
        topCrypts: [Crypt]
    }

    input UsersTopCryptsInput{
        topCrypts: [CryptInput]
    }

    input UserInput{
        id: ID
        age: Int!
        name: String!
        surname: String!
        passport: String!
        email: String!
        password: String!
        wallet: WalletInput
    }

    type Wallet{
        id: ID
        walletEntries: [WalletEntry]
    }

    input WalletInput{
        id: ID
        walletEntries: [WalletEntryInput]!
    }

    type WalletEntry{
        id: ID
        cruptocurrency: Crypt
        amount: Int
    }

    input WalletEntryInput{
        id: ID
        cruptocurrency: CryptInput!
        amount: Int!
    }

    type Crypt{
        id: ID
        rank: String
        symbol: String
        name: String
        supply: String
        maxSupply: String
        marketCapUsd: String
        volumeUsd24Hr: String
        priceUsd: String
        changePercent24Hr: String
        vwap24Hr: String
    }

    input CryptInput{
        id: ID
        rank: String!
        symbol: String!
        name: String!
        supply: String!
        maxSupply: String!
        marketCapUsd: String!
        volumeUsd24Hr: String!
        priceUsd: String!
        changePercent24Hr: String!
        vwap24Hr: String!
    }

    type CryptAbout{
        about: Crypt
        markets: [Markets]
        historyPerDay: [History]
        rates: Rates
    }

    type History{
        date: String
        priceUsd: String
        time: Float
    }

    type Markets{
        baseId: String
        baseSymbol: String
        exchangeId: String
        priceUsd: String
        quoteId: String
        quoteSymbol: String
        volumePercent: String
        volumeUsd24Hr: String
    }

    type Rates{
        currencySymbol: String
        id: String
        rateUsd: String
        symbol: String
        type: String
    }

    type UserReturn{
        user: User
        topCrypts: [Crypt]
        cryptsInWallet: [Crypt]
    }

    type Query{
        getUser(email: String, password: String): UserReturn
        getAllCrypts(offset: Int, limit: Int): [Crypt]
        getCryptAbout(id: ID): CryptAbout
        getPagesAmount: Int
        getFreshDataAboutWallet(ids: String): [Crypt]
    }

    type Mutation{
        createUser(input: UserInput): User
    }
`);

module.exports = schema;
