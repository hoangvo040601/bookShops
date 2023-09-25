const path = require('path');

const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.xlsx$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'public', // Thay đổi đường dẫn đầu ra tùy theo nhu cầu của bạn
                        publicPath: path.resolve(__dirname, './modalUploadFile.js'), // Đường dẫn tới thư mục chứa component
                    },
                },
            ],
        });

        return config;
    },
};

module.exports = nextConfig;