import React from 'react';
import JLPTImageGrid from './JLPTImageGrid';

/**
 * Ví dụ sử dụng JLPTImageGrid với 4 ảnh
 * Bạn có thể thay đổi đường dẫn ảnh theo thư mục của bạn
 */

const JLPTImageGridExample: React.FC = () => {
    // Cách 1: Sử dụng ảnh từ thư mục public/images
    const example1Images = [
        { imageUrl: '/images/mondai1-1.png', label: '1' },
        { imageUrl: '/images/mondai1-2.png', label: '2' },
        { imageUrl: '/images/mondai1-3.png', label: '3' },
        { imageUrl: '/images/mondai1-4.png', label: '4' },
    ];

    // Cách 2: Sử dụng import ảnh trực tiếp
    // import image1 from '@/assets/images/lamp1.png';
    // import image2 from '@/assets/images/lamp2.png';
    // const example2Images = [
    //     { imageUrl: image1, label: '1' },
    //     { imageUrl: image2, label: '2' },
    //     ...
    // ];

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold text-center mb-8">1ばん</h1>

            {/* Grid 2x2 (mặc định) */}
            <JLPTImageGrid images={example1Images} gridLayout="2x2" />

            {/* Hoặc dùng layout 1 hàng 4 cột */}
            {/* <JLPTImageGrid images={example1Images} gridLayout="1x4" /> */}

            {/* Radio buttons cho câu trả lời */}
            <div className="flex justify-center gap-8 mt-8">
                <label className="flex items-center gap-2">
                    <input type="radio" name="answer" value="1" />
                    <span className="text-xl">1</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="answer" value="2" />
                    <span className="text-xl">2</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="answer" value="3" />
                    <span className="text-xl">3</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="answer" value="4" />
                    <span className="text-xl">4</span>
                </label>
            </div>
        </div>
    );
};

export default JLPTImageGridExample;
