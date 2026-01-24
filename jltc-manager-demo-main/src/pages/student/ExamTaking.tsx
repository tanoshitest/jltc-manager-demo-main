import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  Flag,
  Send,
  AlertTriangle,
  PenLine,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import JLPTSectionIntro from "@/components/student/exam/JLPTSectionIntro";
import JLPTCoverPage from "@/components/student/exam/JLPTCoverPage";
import JLPTQuestionView, { JLPTMondai } from "@/components/student/exam/JLPTQuestionView";

// JLPT Specific Mock Data matching the image
// JLPT Section 1 Data (Vocabulary)
export const jlptVocabData: JLPTMondai[] = [
  {
    id: 1,
    instruction: "________の　ことばは　どう　よみますか。\n１・２・３・４から　いちばん　いい　ものを　ひとつ\nえらんで　ください。",
    questions: [
      {
        id: 1,
        mondaiId: 1,
        questionText: "あたらしい　くるまです。",
        options: ["新しい", "新らしい", "新" + "しい", "新い"],
        optionsLayout: '2-col',
        correctAnswer: 0,
      },
      {
        id: 2,
        mondaiId: 1,
        questionText: "でんきを　消して　ください。",
        options: ["天気", "電気", "元気", "電氣"],
        optionsLayout: '4-col',
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 2,
    instruction: "________の　ことばは　ひらがなで　どう\nかきますか。１・２・３・４から　いちばん\nいい　ものを　ひとつ　えらんで　ください。",
    questions: [
      {
        id: 3,
        mondaiId: 2,
        questionText: "外で　たべましょう。",
        options: ["そと", "うち", "なか", "まえ"],
        optionsLayout: '4-col',
        correctAnswer: 0,
      },
      {
        id: 4,
        mondaiId: 2,
        questionText: "ホテルに　とまります。",
        options: ["ほてる", "ほてら", "ほてり", "ほてろ"],
        optionsLayout: '4-col',
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 3,
    instruction: "（　　）に　なにを　いれますか。　１・２・\n３・４から　いちばん　いい　ものを　ひとつ\nえらんで　ください。",
    questions: [
      {
        id: 5,
        mondaiId: 3,
        questionText: (
          <span>
            あそこで　タクシーに　（　　）。
          </span>
        ),
        options: ["のりました", "あがりました", "つきました", "はいりました"],
        optionsLayout: '2-col',
        correctAnswer: 0,
      },
      {
        id: 6,
        mondaiId: 3,
        questionText: (
          <span>
            ここは　（　　）です。　べんきょうできません。
          </span>
        ),
        imageUrl: "/images/jlpt/n5/q6_illustration.png",
        options: ["くらい", "さむい", "うるさい", "あぶない"],
        optionsLayout: '2-col',
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 4,
    instruction: "________の　ぶんと　だいたい　おなじ\nいみの　ぶんが　あります。 1・2・3・4から\nいちばん　いい　ものを　ひとつ　えらんで\nください。",
    questions: [
      {
        id: 7,
        mondaiId: 4,
        questionText: (
          <span className="underline underline-offset-4">
            わたしは　デパートに　つとめて　います。
          </span>
        ),
        options: [
          "わたしは　デパートで　かいものを　して　います。",
          "わたしは　デパートで　さんぽを　して　います。",
          "わたしは　デパートで　しごとを　して　います。",
          "わたしは　デパートで　やすんで　います."
        ],
        optionsLayout: '1-col',
        correctAnswer: 2,
      },
      {
        id: 8,
        mondaiId: 4,
        questionText: (
          <span className="underline underline-offset-4">
            ゆうべ　パーティーへ　いきました。
          </span>
        ),
        options: [
          "きのうの　ひる　パーティーへ　いきました。",
          "きのうの　よる　パーティーへ　いきました。",
          "おとといの　ひる　パーティーへ　いきました。",
          "おとといの　よる　パーティーへ　いきました."
        ],
        optionsLayout: '1-col',
        correctAnswer: 1,
      },
    ],
  },
];

// JLPT Section 2 Data (Grammar / Reading)
export const jlptGrammarData: JLPTMondai[] = [
  {
    id: 1,
    instruction: (
      <span>
        （　　）に　<ruby>何<rt>なに</rt></ruby>を　<ruby>入<rt>い</rt></ruby>れますか。<br />
        １・２・３・４から　いちばん　いい　ものを<br />
        <ruby>一<rt>ひと</rt></ruby>つ　えらんで　ください。
      </span>
    ),
    example: {
      questionText: <span>これ　（　　）　えんぴつです。</span>,
      options: ["１　に", "２　を", "３　は", "４　や"],
      correctAnswer: 2
    },
    questions: [
      {
        id: 1,
        mondaiId: 1,
        questionText: (
          <span>
            <ruby>弟<rt>おとうと</rt></ruby>は　へや　（　　）　そうじを　しました。
          </span>
        ),
        options: ["が", "を", "に", "の"],
        optionsLayout: '4-col',
        correctAnswer: 2,
      },
      {
        id: 2,
        mondaiId: 1,
        questionText: (
          <span>
            きのうは　うちに　（　　）　<ruby>何<rt>なに</rt></ruby>を　しましたか。
          </span>
        ),
        options: ["かえる", "かえるから", "かえって", "かえったり"],
        optionsLayout: '2-col',
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 2,
    instruction: (
      <span>
        <span className="border-b border-black inline-block w-8 text-center mr-1">★</span>に　<ruby>入<rt>はい</rt></ruby>る　ものは　どれですか。<br />
        １・２・３・４から　いちばん　いい　ものを<br />
        <ruby>一<rt>ひと</rt></ruby>つ　えらんで　ください。
      </span>
    ),
    customExample: (
      <div className="text-xl">
        <div className="flex gap-4 mb-4 items-center">
          <span className="font-bold whitespace-nowrap">（もんだいれい）</span>
          <div className="flex flex-col gap-2">
            <div className="flex items-center flex-wrap gap-2">
              <span>A</span>
              <span>「</span>
              <span className="border-b border-black w-14 inline-block"></span>
              <span className="border-b border-black w-14 inline-block"></span>
              <span className="border-b border-black w-14 inline-block relative text-center"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm">★</span></span>
              <span className="border-b border-black w-14 inline-block"></span>
              <span>か。」</span>
            </div>
            <div className="flex items-center gap-2">
              <span>B</span>
              <span>「<ruby>山田<rt>やまだ</rt></ruby>さんです。」</span>
            </div>
          </div>
        </div>
        <div className="flex gap-8 pl-32 mb-8">
          <span>１　です</span>
          <span>２　は</span>
          <span>３　あの<span className="text-xs block text-center">人</span></span>
          <span>４　だれ</span>
        </div>

        <div className="mb-4">
          <span className="font-bold">（こたえかた）</span>
        </div>
        <div className="mb-8 pl-4">
          <div className="mb-4">
            <span>1.　ただしい　<ruby>文<rt>ぶん</rt></ruby>を　つくります。</span>
          </div>
          <div className="border border-black p-6 inline-block min-w-[600px] bg-white pt-10">
            <div className="grid grid-cols-[40px_30px_1fr] gap-y-8 items-end">
              {/* Row A */}
              <div className="font-bold text-2xl text-center font-serif pb-2">A</div>
              <div className="font-bold text-2xl font-serif pb-2">「</div>
              <div className="flex items-end flex-wrap gap-1 font-serif">
                <div className="flex flex-col items-center mx-2">
                  <span className="border-b border-black w-24 mb-2"></span>
                  <span className="font-bold text-base whitespace-nowrap">3 あの人</span>
                </div>
                <div className="flex flex-col items-center mx-2">
                  <span className="border-b border-black w-16 mb-2"></span>
                  <span className="font-bold text-base whitespace-nowrap">2 は</span>
                </div>
                <div className="flex flex-col items-center mx-2 relative">
                  <span className="absolute -top-6 text-sm">★</span>
                  <span className="border-b border-black w-20 mb-2"></span>
                  <span className="font-bold text-base whitespace-nowrap">4 だれ</span>
                </div>
                <div className="flex flex-col items-center mx-2">
                  <span className="border-b border-black w-16 mb-2"></span>
                  <span className="font-bold text-base whitespace-nowrap">1 です</span>
                </div>
                <div className="ml-2 pb-2 text-xl font-bold">か。」</div>
              </div>

              {/* Row B */}
              <div className="font-bold text-2xl text-center font-serif pb-1">B</div>
              <div className="font-bold text-2xl font-serif pb-1">「</div>
              <div className="text-xl font-serif pb-1">
                <ruby>山田<rt>やまだ</rt></ruby>さんです。」
              </div>
            </div>
          </div>
          <div className="mt-6 mb-4">
            <span>2.　<span className="border-b border-black inline-block w-8 text-center mr-1 relative"><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs">★</span></span>に　<ruby>入<rt>はい</rt></ruby>る　ばんごうを　くろく　ぬります。</span>
          </div>
          <div className="flex gap-4 items-center pl-8 text-xl">
            <span>（かいとうようし）</span>
            <div className="border border-black px-4 py-1 flex gap-2 items-center">
              <span className="font-bold">（れい）</span>
              <div className="flex gap-1 text-lg">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="w-8 h-8 flex items-center justify-center">
                    {num === 4 ? (
                      <div className="w-6 h-6 bg-black rounded-full" />
                    ) : (
                      <span className="border border-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-sans font-bold">
                        {num}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 3,
        mondaiId: 2,
        questionText: (
          <div className="text-xl md:text-2xl mt-2 leading-relaxed">
            <div className="flex flex-wrap items-end gap-2 mb-2">
              <span>これは　きょねん　わたし</span>
              <span className="border-b border-black w-16 inline-block mx-1"></span>
              <span className="border-b border-black w-16 inline-block mx-1"></span>
              <span className="border-b border-black w-16 inline-block mx-1 relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl">★</span></span>
              <span className="border-b border-black w-16 inline-block mx-1"></span>
            </div>
            <div>
              <span>しゃしんです。</span>
            </div>
          </div>
        ),
        options: ["が", "で", "とった", "海"],
        optionsLayout: '4-col',
        correctAnswer: 1,
      },
      {
        id: 4,
        mondaiId: 2,
        questionText: (
          <div className="text-xl md:text-2xl mt-2 leading-relaxed">
            <div className="flex flex-wrap items-end gap-2 mb-2">
              <span>きのう、</span>
              <span className="border-b border-black w-16 inline-block mx-1"></span>
              <span className="border-b border-black w-16 inline-block mx-1"></span>
              <span className="border-b border-black w-16 inline-block mx-1 relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl">★</span></span>
              <span className="border-b border-black w-16 inline-block mx-1"></span>
              <span>。</span>
            </div>
          </div>
        ),
        options: [
          <span><ruby>買<rt>か</rt></ruby>いに</span>,
          <span><ruby>日本語<rt>にほんご</rt></ruby>の</span>,
          <span><ruby>行<rt>い</rt></ruby>きました</span>,
          <span>じしょを</span>
        ],
        optionsLayout: '2-col',
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 3,
    instruction: (
      <span>
        [<span className="border border-black px-1 font-bold inline-block text-center w-8">5</span>] から [<span className="border border-black px-1 font-bold inline-block text-center w-8">9</span>] に <ruby>何<rt>なに</rt></ruby>を <ruby>入<rt>い</rt></ruby>れますか。<br />
        １・２・３・４ から いちばん いい ものを <ruby>一<rt>ひと</rt></ruby>つ<br />
        えらんで ください。
      </span>
    ),
    passage: (
      <div>
        <div className="mb-6">
          ジョンさんと　ヤンさんは　あした　じこしょうかいを　します。<ruby>二人<rt>ふたり</rt></ruby>は　じこしょうかいの　ぶんしょうを　<ruby>書<rt>か</rt></ruby>きました。
        </div>

        {/* Reading 1: John */}
        <div className="mb-8">
          <div className="mb-2 pl-2">（１）</div>
          <div className="border border-black p-4 md:p-6 bg-white">
            <p className="mb-4">
              はじめまして。ジョン・スミスです。アメリカから　<span className="border border-black px-1 mx-1 font-bold inline-block min-w-[30px] text-center">5</span> 。
            </p>
            <p className="mb-4">
              わたしは　えいがが　<ruby>好<rt>す</rt></ruby>きです。アメリカの　えいがは　よく　<ruby>知<rt>し</rt></ruby>っています。<span className="border border-black px-1 mx-1 font-bold inline-block min-w-[30px] text-center">6</span> 、<ruby>日本<rt>にほん</rt></ruby>の　えいがは　あまり　<ruby>知<rt>し</rt></ruby>りません。<ruby>日本<rt>にほん</rt></ruby>では、<ruby>日本<rt>にほん</rt></ruby>の　えいがを　たくさん　<span className="border border-black px-1 mx-1 font-bold inline-block min-w-[30px] text-center">7</span> 。
            </p>
            <p>
              どうぞ　よろしく　おねがいします。
            </p>
          </div>
        </div>

        {/* Reading 2: Yang */}
        <div className="mb-8">
          <div className="mb-2 pl-2">（２）</div>
          <div className="border border-black p-4 md:p-6 bg-white">
            <p className="mb-4">
              みなさん、こんにちは。ヤンです。
            </p>
            <p className="mb-4">
              わたしは　<ruby>日本語学校<rt>にほんごがっこう</rt></ruby>で　<ruby>毎日<rt>まいにち</rt></ruby>　べんきょうして　います。<ruby>今<rt>いま</rt></ruby>は、<ruby>学校<rt>がっこう</rt></ruby>の　ちかくに　<ruby>姉<rt>あね</rt></ruby>と　<ruby>住<rt>す</rt></ruby>んで　います。<ruby>姉<rt>あね</rt></ruby>が　いるから、　<span className="border border-black px-1 mx-1 font-bold inline-block min-w-[30px] text-center">8</span> 。
            </p>
            <p className="mb-4">
              わたしは、<ruby>日本<rt>にほん</rt></ruby>で　たくさん　<ruby>友<rt>とも</rt></ruby>だちが　ほしいです。
            </p>
            <p className="mb-4">
              みなさん、 <span className="border border-black px-1 mx-1 font-bold inline-block min-w-[30px] text-center">9</span> 。
            </p>
            <p>
              どうぞ　よろしく　おねがいします。
            </p>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 5,
        mondaiId: 3,
        questionText: <></>,
        options: [
          <span><ruby>行<rt>い</rt></ruby>きます</span>,
          <span><ruby>行<rt>い</rt></ruby>きました</span>,
          <span><ruby>来<rt>き</rt></ruby>ます</span>,
          <span><ruby>来<rt>き</rt></ruby>ました</span>
        ],
        optionsLayout: '2-col',
        correctAnswer: 3
      },
      {
        id: 6,
        mondaiId: 3,
        questionText: <></>,
        options: [
          <span>では</span>,
          <span>だから</span>,
          <span>でも</span>,
          <span>それから</span>
        ],
        optionsLayout: '4-col',
        correctAnswer: 2
      },
      {
        id: 7,
        mondaiId: 3,
        questionText: <></>,
        options: [
          <span><ruby>見<rt>み</rt></ruby>ました</span>,
          <span><ruby>見<rt>み</rt></ruby>たいです</span>,
          <span><ruby>見<rt>み</rt></ruby>て　いました</span>,
          <span><ruby>見<rt>み</rt></ruby>るからです</span>
        ],
        optionsLayout: '2-col',
        correctAnswer: 1
      },
      {
        id: 8,
        mondaiId: 3,
        questionText: <></>,
        options: [
          <span>さびしく　ありません</span>,
          <span>さびしく　ありませんでした</span>,
          <span>さびしく　ありませんか</span>,
          <span>さびしく　ありませんでしたか</span>
        ],
        optionsLayout: '1-col',
        correctAnswer: 2
      },
      {
        id: 9,
        mondaiId: 3,
        questionText: <></>,
        options: [
          <span><ruby>学校<rt>がっこう</rt></ruby>に　<ruby>毎日<rt>まいにち</rt></ruby>　<ruby>行<rt>い</rt></ruby>きませんか</span>,
          <span><ruby>学校<rt>がっこう</rt></ruby>で　<ruby>友<rt>とも</rt></ruby>だちと　あそびました</span>,
          <span>うちに　あそびに　<ruby>来<rt>き</rt></ruby>て　ください</span>,
          <span>うちで　<ruby>姉<rt>あね</rt></ruby>と　あそびたいです</span>
        ],
        optionsLayout: '1-col',
        correctAnswer: 2
      },
    ],
  },
  {
    id: 4,
    instruction: (
      <span>
        つぎの　ぶんを　<ruby>読<rt>よ</rt></ruby>んで　しつもんに<br />
        こたえて　ください。こたえは　１・２・３・４　から<br />
        いちばん　いい　ものを　<ruby>一<rt>ひと</rt></ruby>つ　えらんで<br />
        ください。
      </span>
    ),
    passage: (
      <div className="mx-2 md:mx-6">
        <div className="mb-8 pl-1">
          <ruby>先生<rt>せんせい</rt></ruby>が　アンナさんに　<ruby>手紙<rt>てがみ</rt></ruby>を　<ruby>書<rt>か</rt></ruby>きました。
        </div>
        <div className="border border-black p-8 max-w-2xl mx-auto bg-white text-xl leading-relaxed">
          <div className="mb-12">アンナさん</div>
          <div className="mb-2">
            <ruby>今週<rt>こんしゅう</rt></ruby>は　しごとが　たくさん　あります。<ruby>土曜日<rt>どようび</rt></ruby>と
          </div>
          <div className="mb-2">
            <ruby>日曜日<rt>にちようび</rt></ruby>も　いそがしいです。
          </div>
          <div>
            <ruby>来週<rt>らいしゅう</rt></ruby>の　<ruby>月曜日<rt>げつようび</rt></ruby>に　<ruby>来<rt>き</rt></ruby>て　ください。
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 10,
        mondaiId: 4,
        questionText: (
          <span>
            <ruby>先生<rt>せんせい</rt></ruby>は　いつ　<ruby>時間<rt>じかん</rt></ruby>が　ありますか。
          </span>
        ),
        options: [
          <span><ruby>今週<rt>こんしゅう</rt></ruby></span>,
          <span><ruby>土曜日<rt>どようび</rt></ruby></span>,
          <span><ruby>日曜日<rt>にちようび</rt></ruby></span>,
          <span><ruby>月曜日<rt>げつようび</rt></ruby></span>
        ],
        optionsLayout: '1-col',
        correctAnswer: 3 // Month 0-indexed? No answers 1-4. Index 3 is Option 4 (Monday).
      }
    ]
  },
  {
    id: 5,
    instruction: (
      <span>
        つぎの　ぶんを　<ruby>読<rt>よ</rt></ruby>んで　しつもんに<br />
        こたえて　ください。こたえは　１・２・３・４　から<br />
        いちばん　いい　ものを　<ruby>一<rt>ひと</rt></ruby>つ　えらんで<br />
        ください。
      </span>
    ),
    passage: (
      <div className="mx-2 md:mx-6 leading-loose text-xl">
        <p className="mb-6">
          ヤンさんの　うちは　<ruby>町<rt>まち</rt></ruby>の　<ruby>中<rt>なか</rt></ruby>の　べんりな　ところに<br />
          あります。
        </p>
        <p className="mb-6">
          となりに　パンやが　あります。<ruby>前<rt>まえ</rt></ruby>は　はなやで、<br />
          はなやの　となりは　さかなやです。<ruby>遠<rt>とお</rt></ruby>くに　くすりやと<br />
          にくやも　あります。ゆうびんきょくと　びょういんも<br />
          あります。
        </p>
        <p className="mb-6">
          <ruby>今日<rt>きょう</rt></ruby>の　ゆうがた、ヤンさんの　<ruby>友<rt>とも</rt></ruby>だちが　あそびに<br />
          <ruby>来<rt>き</rt></ruby>ます。ヤンさんは　とりにくの　りょうりと　さかなの<br />
          りょうりを　<ruby>作<rt>つく</rt></ruby>ります。れいぞうこの　<ruby>中<rt>なか</rt></ruby>に　とりにくと<br />
          さかなが　ありませんから、ヤンさんは　これから<br />
          <ruby>買<rt>か</rt></ruby>いものに　でかけます。それから、ゆうびんきょくへ<br />
          <ruby>行<rt>い</rt></ruby>って、きってを　<ruby>買<rt>か</rt></ruby>います。
        </p>
      </div>
    ),
    questions: [
      {
        id: 11,
        mondaiId: 5,
        questionText: (
          <span>
            つぎの　<ruby>中<rt>なか</rt></ruby>で、ヤンさんの　うちから　いちばん<br />
            <ruby>近<rt>ちか</rt></ruby>い　<ruby>店<rt>みせ</rt></ruby>は　どれ　ですか。
          </span>
        ),
        options: [
          <span>にくや</span>,
          <span>パンや</span>,
          <span>くすりや</span>,
          <span>さかなや</span>
        ],
        optionsLayout: '1-col',
        correctAnswer: 1 // Pan-ya (Option 2 -> Index 1)
      }
    ]
  },
  {
    id: 6,
    instruction: (
      <span>
        つぎの　ぶんを　<ruby>読<rt>よ</rt></ruby>んで、「<ruby>電車<rt>でんしゃ</rt></ruby>の　<ruby>時間<rt>じかん</rt></ruby>」と<br />
        「バスの　<ruby>時間<rt>じかん</rt></ruby>」を　<ruby>見<rt>み</rt></ruby>て、　しつもんに<br />
        こたえて　ください。こたえは　1・2・3・4　から<br />
        いちばん　いい　ものを　<ruby>一<rt>ひと</rt></ruby>つ　えらんで<br />
        ください。
      </span>
    ),
    passage: (
      <div className="mx-2 md:mx-6 leading-loose text-xl text-center">
        {/* Box 1: Train Time */}
        <div className="relative border border-black p-4 md:p-8 max-w-2xl mx-auto bg-white mb-8">
          {/* Corner Cover (Hides original border) */}
          <div className="absolute -bottom-[1px] -right-[1px] w-9 h-9 bg-white z-10"></div>
          {/* Darker Backside Fold Effect with Borders */}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400 border-t border-l border-black rounded-bl-lg shadow-[-2px_-2px_6px_rgba(0,0,0,0.3)] pointer-events-none z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>


          {/* Train Header */}
          <div className="flex justify-between items-end px-4 relative h-24 mb-10">
            <div className="absolute left-0 top-0 w-52 -mt-12 text-center">
              <img src="/train_local.png" alt="Local Train" className="w-full grayscale mix-blend-multiply mb-1" />
              <div className="absolute top-[40%] left-[45%] text-[10px] font-bold bg-white px-0.5 border border-black leading-none">ふじ</div>
            </div>

            <div className="text-center font-bold mx-auto z-10 pt-2 flex flex-col items-center">
              <div className="text-sm mb-1"><ruby>電車<rt>でんしゃ</rt></ruby>の</div>
              <div className="text-4xl tracking-[0.2em] relative">
                <span className="relative z-10"><ruby>時間<rt>じかん</rt></ruby></span>
              </div>
            </div>

            <div className="absolute right-0 top-0 w-56 -mt-16 text-center pt-2">
              <img src="/train_shinkansen.png" alt="Shinkansen" className="w-full grayscale mix-blend-multiply" />
              <div className="absolute top-[48%] left-[25%] text-[10px] font-bold bg-white px-0.5 border border-black leading-none">さくら</div>
            </div>
          </div>

          {/* Train Table */}
          <div className="border-2 border-black mb-6">
            {/* Header Row */}
            <div className="flex border-b-2 border-black">
              <div className="w-[30%] border-r-2 border-black p-2 flex flex-col items-center justify-center">
                <div className="text-xs leading-none mb-1"><ruby>電車<rt>でんしゃ</rt></ruby></div>
                <div className="text-xl font-serif">電車</div>
              </div>
              <div className="w-[70%] p-2 flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-xs leading-none mb-1"><ruby>東京駅<rt>とうきょうえき</rt></ruby></div>
                  <div className="text-lg">東京駅</div>
                </div>
                <div className="text-4xl text-white drop-shadow-[0_0_1px_black] scale-x-[2]">⇨</div>
                <div className="text-center">
                  <div className="text-xs leading-none mb-1"><ruby>中川駅<rt>なかがわえき</rt></ruby></div>
                  <div className="text-lg">中川駅</div>
                </div>
              </div>
            </div>
            {/* Data Rows */}
            {[
              { name: "ふじ 1", dept: "8 : 2 0", arr: "1 0 : 2 0" },
              { name: "さくら 1", dept: "9 : 1 0", arr: "1 0 : 1 0" },
              { name: "ふじ 3", dept: "9 : 2 0", arr: "1 1 : 2 0" },
              { name: "さくら 3", dept: "1 0 : 1 0", arr: "1 1 : 1 0" },
            ].map((row, idx, arr) => (
              <div key={idx} className={`flex ${idx !== arr.length - 1 ? 'border-b border-black' : ''} text-lg md:text-xl h-12`}>
                <div className="w-[30%] border-r border-black flex items-center justify-center font-serif tracking-widest bg-white">
                  {row.name}
                </div>
                <div className="w-[35%] border-r border-black flex items-center justify-center tracking-[0.2em]">
                  {row.dept}
                </div>
                <div className="w-[35%] flex items-center justify-center tracking-[0.2em]">
                  {row.arr}
                </div>
              </div>
            ))}
          </div>

          {/* Prices */}
          <div className="text-center">
            <div className="mb-2">
              （お<ruby>金<rt>かね</rt></ruby>） ふ　じ ： 3,000<ruby>円<rt>えん</rt></ruby>
            </div>
            <div>
              さくら ： 5,000<ruby>円<rt>えん</rt></ruby>
            </div>
          </div>
        </div>

        {/* Box 2: Bus Time */}
        <div className="relative border border-black p-4 md:p-8 max-w-2xl mx-auto bg-white">
          {/* Corner Cover (Hides original border) */}
          <div className="absolute -bottom-[1px] -right-[1px] w-9 h-9 bg-white z-10"></div>
          {/* Darker Backside Fold Effect with Borders */}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400 border-t border-l border-black rounded-bl-lg shadow-[-2px_-2px_6px_rgba(0,0,0,0.3)] pointer-events-none z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>

          {/* Bus Header */}
          <div className="flex justify-center items-center mb-6 gap-4 relative">
            <div className="w-24 -ml-12">
              <img src="/bus_local.png" alt="Bus" className="w-full grayscale mix-blend-multiply" />
            </div>
            <div className="text-center font-bold">
              <div className="text-sm text-right pr-9 mb-1"><ruby>じかん<rt></rt></ruby></div>
              <div className="text-2xl tracking-[0.2em] flex items-baseline gap-2">
                <span>バスの</span>
                <span className="text-3xl">時間</span>
              </div>
            </div>
          </div>

          {/* Bus Table */}
          <div className="border-2 border-black mb-6 w-3/4 mx-auto">
            {/* Header */}
            <div className="flex border-b-2 border-black p-3 justify-center items-center gap-8 bg-white">
              <div className="text-center">
                <div className="text-xs leading-none mb-1"><ruby>中川駅<rt>なかがわえき</rt></ruby></div>
                <div className="text-lg tracking-wider">中川駅</div>
              </div>
              <div className="text-4xl text-white drop-shadow-[0_0_1px_black] scale-x-[2]">⇨</div>
              <div className="text-center">
                <div className="text-xs leading-none mb-1 text-right"><ruby>山<rt>やま</rt></ruby></div>
                <div className="text-lg tracking-wider">いちご山</div>
              </div>
            </div>
            {/* Rows */}
            <div className="flex border-b border-black text-xl h-12">
              <div className="w-1/2 border-r border-black flex items-center justify-center tracking-[0.2em]">1 0 : 3 0</div>
              <div className="w-1/2 flex items-center justify-center tracking-[0.2em]">1 1 : 0 0</div>
            </div>
            <div className="flex text-xl h-12">
              <div className="w-1/2 border-r border-black flex items-center justify-center tracking-[0.2em]">1 1 : 3 0</div>
              <div className="w-1/2 flex items-center justify-center tracking-[0.2em]">1 2 : 0 0</div>
            </div>
          </div>

          {/* Bus Price */}
          <div className="text-center">
            （お<ruby>金<rt>かね</rt></ruby>） 800<ruby>円<rt>えん</rt></ruby>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 13,
        mondaiId: 6,
        questionText: (
          <span>
            <ruby>電車<rt>でんしゃ</rt></ruby>は　どれに　<ruby>乗<rt>の</rt></ruby>りますか。
          </span>
        ),
        options: [
          <span>ふじ1</span>,
          <span>さくら1</span>,
          <span>ふじ3</span>,
          <span>さくら3</span>
        ],
        optionsLayout: '1-col',
        correctAnswer: 1
      }
    ]
  }
];

// (Old OpenBookGraphic removed)

// Helper for cropping 2-panel images
const ImageCropper = ({ src, side, alt }: { src: string, side: 'left' | 'right', alt: string }) => (
  <div className="w-full relative overflow-hidden" style={{ paddingBottom: '75%' }}> {/* Aspect ratio placeholder */}
    <img
      src={src}
      alt={alt}
      className="absolute top-0 h-full max-w-none w-[200%]"
      style={{ left: side === 'left' ? '0' : '-100%' }}
    />
  </div>
);

// Helper component for Open Book Graphic
const OpenBookGraphic = ({
  panelId,
  variant
}: {
  panelId: number;
  variant: 'both-pages' | 'right-page' | 'right-top' | 'right-bottom'
}) => {
  return (
    <div className="border border-black p-2 relative bg-white w-full max-w-[280px] mx-auto aspect-[4/3] flex flex-col">
      <div className="text-xl font-bold pl-2">{panelId}</div>
      <div className="flex-1 flex items-center justify-center relative p-2">
        {/* Book Container */}
        <div className="flex relative w-full h-[120px]">
          {/* Left Page */}
          <div className="w-1/2 h-full border-2 border-black border-r-0 rounded-l-sm rounded-bl-[30px] bg-white relative">
            <div className="absolute top-2 left-2 right-2 h-10 border border-black flex items-center justify-center font-bold">1</div>
            <div className="absolute top-14 left-2 right-2 h-10 border border-black flex items-center justify-center font-bold">2</div>
            <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-bold">-20-</div>
          </div>

          {/* Right Page */}
          <div className="w-1/2 h-full border-2 border-black border-l-0 rounded-r-sm rounded-br-[30px] bg-white relative">
            <div className="absolute top-2 left-2 right-2 h-10 border border-black flex items-center justify-center font-bold">1</div>
            <div className="absolute top-14 left-2 right-2 h-10 border border-black flex items-center justify-center font-bold">2</div>
            <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-bold">-21-</div>
          </div>

          {/* Spine Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-black -translate-x-1/2 z-10"></div>

          {/* "Shukudai" Caption */}
          <div className="absolute -bottom-6 right-0 text-xs font-bold">しゅくだい</div>

          {/* Highlight Circles */}
          {variant === 'both-pages' && (
            <div className="absolute top-0 left-0 right-0 bottom-0 border-[3px] border-black rounded-[40%] scale-x-105 scale-y-110 z-20"></div>
          )}
          {variant === 'right-page' && (
            <div className="absolute top-0 right-0 w-1/2 h-full border-[3px] border-black rounded-[40%] scale-110 translate-x-1 z-20"></div>
          )}
          {variant === 'right-top' && (
            <div className="absolute top-1 right-2 w-[45%] h-[45%] border-[3px] border-black rounded-[50%] z-20"></div>
          )}
          {variant === 'right-bottom' && (
            <div className="absolute bottom-6 right-2 w-[45%] h-[45%] border-[3px] border-black rounded-[50%] z-20"></div>
          )}
        </div>
      </div>
    </div>
  );
};

// JLPT Section 3 Data (Listening)
export const jlptListeningData: JLPTMondai[] = [
  {
    id: 1,
    instruction: (
      <div>
        <h2 className="text-3xl font-bold mb-4">もんだい 1</h2>
        <div className="leading-loose text-lg space-y-2">
          <p>もんだい１では　はじめに、　しつもんを　きいて　ください。</p>
          <p>それから　はなしを　きいて、　もんだいようしの　１から４の</p>
          <p>なかから、　ただしい　こたえを　ひとつ　えらんで　ください。</p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        mondaiId: 1,
        questionText: (
          <div className="space-y-6">
            <div className="text-2xl font-bold">1 ばん</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <OpenBookGraphic panelId={1} variant="both-pages" />
              <OpenBookGraphic panelId={2} variant="right-page" />
              <OpenBookGraphic panelId={3} variant="right-top" />
              <OpenBookGraphic panelId={4} variant="right-bottom" />
            </div>
          </div>
        ),
        options: ["1", "2", "3", "4"],
        optionsLayout: "4-col",
        correctAnswer: 0
      },
      {
        id: 2,
        mondaiId: 1,
        questionText: (
          <div className="space-y-6">
            <div className="text-2xl font-bold">2 ばん</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <img src="/images/jlpt/n5_q2/1.png" alt="Boys playing at beach" className="w-full aspect-square object-contain" />
              </div>
              <div>
                <img src="/images/jlpt/n5_q2/2.png" alt="Boys at aquarium" className="w-full aspect-square object-contain" />
              </div>
              <div>
                <img src="/images/jlpt/n5_q2/3.png" alt="Boys reading in library" className="w-full aspect-square object-contain" />
              </div>
              <div>
                <img src="/images/jlpt/n5_q2/4.png" alt="Boys at ticket counter" className="w-full aspect-square object-contain" />
              </div>
            </div>
          </div>
        ),
        options: ["1", "2", "3", "4"],
        optionsLayout: "4-col",
        correctAnswer: 0
      }
    ]
  },
  {
    id: 2,
    instruction: (
      <div>
        <h2 className="text-3xl font-bold mb-4">もんだい 2</h2>
        <div className="leading-loose text-lg space-y-2">
          <p>もんだい２では、　はじめに　しつもんを　きいて　ください。</p>
          <p>それから　えを　みて、　もんだいようしの　１から４の　なかから、</p>
          <p>ただしい　こたえを　ひとつ　えらんで　ください。</p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 3,
        mondaiId: 2,
        questionText: (
          <div className="space-y-6">
            <div className="text-2xl font-bold">1 ばん</div>
            <div className="flex justify-center pt-4">
              <img
                src="/images/jlpt/n5_m2_q1.png"
                alt="Group of 5 people with pointers"
                className="max-w-full h-auto border-2 border-black max-h-[400px]"
              />
            </div>
          </div>
        ),
        options: ["1", "2", "3", "4"],
        optionsLayout: "4-col",
        correctAnswer: 0
      },
      {
        id: 4,
        mondaiId: 2,
        questionText: (
          <div className="space-y-6">
            <div className="text-2xl font-bold">2 ばん</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <img src="/images/jlpt/n5_q2/1.png" alt="Placeholder: Movie" className="w-full aspect-square object-contain" />
              </div>
              <div>
                <img src="/images/jlpt/n5_q2/2.png" alt="Placeholder: Laundry" className="w-full aspect-square object-contain" />
              </div>
              <div>
                <img src="/images/jlpt/n5_q2/3.png" alt="Placeholder: Vacuum" className="w-full aspect-square object-contain" />
              </div>
              <div>
                <img src="/images/jlpt/n5_q2/4.png" alt="Placeholder: Study" className="w-full aspect-square object-contain" />
              </div>
            </div>
          </div>
        ),
        options: ["1", "2", "3", "4"],
        optionsLayout: "4-col",
        correctAnswer: 0
      }
    ]
  },
  {
    id: 3,
    instruction: (
      <div>
        <h2 className="text-3xl font-bold mb-4">もんだい 3</h2>
        <div className="leading-loose text-lg space-y-2">
          <p>もんだい３では、　えを　みて　ください。</p>
          <p>やじるしの　ひとは　なんと　いいますか。</p>
          <p>１から３の　なかから、　ただしい　こたえを　ひとつ　えらんで　ください。</p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 5,
        mondaiId: 3,
        questionText: (
          <div className="space-y-6">
            <div className="text-2xl font-bold">1 ばん</div>
            <div className="flex justify-center pt-4">
              {/* Placeholder for Restaurant Scene (Woman & Waitress) */}
              <div className="relative border-2 border-black w-full max-w-[400px] aspect-[4/3] flex items-center justify-center bg-gray-100">
                <span className="text-gray-500 font-bold p-4 text-center">
                  PLACEHOLDER: Restaurant Scene<br />
                  (Woman sitting, Waitress standing)<br />
                  Arrow pointing to Woman
                </span>
              </div>
            </div>
          </div>
        ),
        options: ["1", "2", "3"],
        optionsLayout: "3-col",
        correctAnswer: 0
      },
      {
        id: 6,
        mondaiId: 3,
        questionText: (
          <div className="space-y-6">
            <div className="text-2xl font-bold">2 ばん</div>
            <div className="flex justify-center pt-4">
              {/* Placeholder for Study/Classroom Scene (Two Men) */}
              <div className="relative border-2 border-black w-full max-w-[400px] aspect-[4/3] flex items-center justify-center bg-gray-100">
                <span className="text-gray-500 font-bold p-4 text-center">
                  PLACEHOLDER: Study Scene<br />
                  (Two men at desk)<br />
                  Arrow pointing to Man on Right
                </span>
              </div>
            </div>
          </div>
        ),
        options: ["1", "2", "3"],
        optionsLayout: "3-col",
        correctAnswer: 0
      }
    ]
  },
  {
    id: 4,
    instruction: (
      <div>
        <h2 className="text-3xl font-bold mb-4">もんだい 4</h2>
        <div className="leading-loose text-lg space-y-2">
          <p>もんだい４では、　え　などが　ありません。</p>
          <p>はじめに　ぶんを　きいて　ください。</p>
          <p>それから　その　へんじを　きいて、　１から３の　なかから、</p>
          <p>ただしい　こたえを　ひとつ　えらんで　ください。</p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 7,
        mondaiId: 4,
        questionText: (
          <div className="space-y-6">
            <div className="text-2xl font-bold">1 ばん</div>
          </div>
        ),
        options: ["1", "2", "3"],
        optionsLayout: "3-col",
        correctAnswer: 0
      },
      {
        id: 8,
        mondaiId: 4,
        questionText: (
          <div className="space-y-6">
            <div className="text-2xl font-bold">2 ばん</div>
          </div>
        ),
        options: ["1", "2", "3"],
        optionsLayout: "3-col",
        correctAnswer: 0
      }
    ]
  }
];

// Mock basic exam data shell
const mockExam = {
  id: 1,
  title: "JLPT N5 - Đề thi thử",
  duration: 0, // Managed dynamically
  examType: "jlpt",
  hasEssay: false,
  questions: [],
};

type Answer = string | string[] | null;
type ExamStep = 'cover' | 'intro' | 'taking';

const ExamTaking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [activeSection, setActiveSection] = useState<1 | 2 | 3>(1); // 1: Vocab, 2: Grammar, 3: Listening
  const [timeLeft, setTimeLeft] = useState(20 * 60); // Start with 20 mins for Sec 1
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // Initialize exam step
  const [examStep, setExamStep] = useState<ExamStep>(
    mockExam.examType === "jlpt" ? 'cover' : 'taking'
  );

  // Load correct data based on active section
  const currentData = activeSection === 1 ? jlptVocabData : (activeSection === 2 ? jlptGrammarData : jlptListeningData);
  const currentDuration = 60; // Fixed 60 minutes for all sections
  const currentSectionName = activeSection === 1 ? "言語知識（文字・語彙）" : (activeSection === 2 ? "言語知識（文法）・読解" : "聴解");
  const currentVariant = "white";
  const currentSubTitle = undefined;

  // Timer (disabled)
  useEffect(() => {
    if (examStep !== 'taking') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        if (prev <= 120 && prev > 119) { // Warning at 2 mins
          setShowTimeWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStep]);

  // Autosave
  useEffect(() => {
    const saveAnswers = () => {
      localStorage.setItem(`exam-${id}-answers-sec${activeSection}`, JSON.stringify(answers));
      localStorage.setItem(`exam-${id}-flagged-sec${activeSection}`, JSON.stringify([...flaggedQuestions]));
    };
    saveAnswers();
  }, [answers, flaggedQuestions, id, activeSection]);

  // Load saved answers on mount or section change
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`exam-${id}-answers-sec${activeSection}`);
    const savedFlagged = localStorage.getItem(`exam-${id}-flagged-sec${activeSection}`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    } else {
      setAnswers({}); // Clear answers if no saved data for this section
    }
    if (savedFlagged) {
      setFlaggedQuestions(new Set(JSON.parse(savedFlagged)));
    } else {
      setFlaggedQuestions(new Set()); // Clear flags if no saved data for this section
    }
    // Load saved answer/flags but RESET timer to 60 mins on reload
    // We intentionally ignore savedTime from localStorage
    setTimeLeft(currentDuration * 60);
  }, [id, activeSection, currentDuration]);

  // Save time left periodically
  // Save time left periodically (Disabled to ensure reset on reload)
  /*
  useEffect(() => {
    if (examStep === 'taking') {
      localStorage.setItem(`exam-${id}-timeleft-sec${activeSection}`, timeLeft.toString());
    }
  }, [timeLeft, id, activeSection, examStep]);
  */


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const proceedToNextSection = () => {
    if (activeSection === 1) {
      // Transition to Section 2
      setActiveSection(2);
      setExamStep('intro'); // Show intro directly for sec 2
      setTimeLeft(60 * 60); // Reset time to 60 mins for section 2
      setAnswers({}); // Clear answers for the new section
      setFlaggedQuestions(new Set()); // Clear flags for the new section
      window.scrollTo(0, 0);
      setShowSubmitDialog(false);
    } else if (activeSection === 2) {
      // Transition to Section 3
      setActiveSection(3);
      setExamStep('intro'); // SKIP cover for section 3, go to intro
      setTimeLeft(60 * 60); // Reset time to 60 mins for section 3
      setAnswers({}); // Clear answers for the new section
      setFlaggedQuestions(new Set()); // Clear flags for the new section
      window.scrollTo(0, 0);
      setShowSubmitDialog(false);
    } else {
      // Finish Exam (activeSection === 3)
      toast({
        title: "Hoàn thành bài thi!",
        description: "Kết quả của bạn đã được ghi nhận.",
      });
      navigate(`/student/result/${id}`); // Navigate to results page
    }
  };

  const handleAutoSubmit = () => {
    toast({
      title: "Hết giờ!",
      description: activeSection === 1 ? "Đang chuyển sang phần thi tiếp theo." : "Bài làm của bạn đã được nộp tự động.",
      variant: "destructive",
    });
    proceedToNextSection();
  };

  const handleSubmit = () => {
    proceedToNextSection();
  };

  const handleAnswer = (questionId: number, answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // ... (renderQuestion logic for basic exams can remain or be simplified) ...
  // Keeping it minimal as we are focusing on JLPT view
  const renderBasicQuestion = (question: any) => null;

  if (examStep === 'cover') {
    return (
      <JLPTCoverPage
        onStart={() => setExamStep('intro')}
        level="N5"
        sectionName={currentSectionName}
        title={currentSectionName}
        subTitle={currentSubTitle}
        variant={currentVariant}
        examineeNumber="2026-0001"
        examineeName="NGUYEN VAN A"
      />
    );
  }

  if (examStep === 'intro') {
    return (
      <JLPTSectionIntro
        onNext={() => setExamStep('taking')}
        level="N5"
        sectionName={currentSectionName}
        subTitle={currentSubTitle}
        variant={currentVariant}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4 lg:px-8 shadow-sm">
        <h1 className="font-semibold text-lg truncate max-w-[200px] md:max-w-md">{mockExam.title}</h1>
        <div className="flex items-center gap-4">
          {activeSection === 3 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 bg-white border-gray-300 hover:bg-gray-100"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/pdfs/jlpt_n5_script.pdf';
                  link.download = 'jlpt_n5_script.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <FileText className="h-4 w-4" />
                Script
              </Button>
              <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 border border-gray-200">
                <audio id="exam-audio-player" controls className="h-8 w-48 lg:w-64">
                  <source src="/audio/jlpt_n5_audio.mp3" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
          {/* Timer Display */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-lg font-bold",
            timeLeft <= 300 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
          )}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <Button onClick={() => setShowSubmitDialog(true)} variant="default" className="bg-black hover:bg-gray-800 text-white">
            Nộp bài
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 md:px-0 max-w-5xl mx-auto">
        {mockExam.examType === 'jlpt' ? (
          <>
            {/* Audio Player for Listening Section */}

            <JLPTQuestionView
              mondaiList={currentData}
              answers={answers}
              onAnswer={(qid, ans) => handleAnswer(qid, ans)}
              hideQuestionId={activeSection === 3}
            />
          </>
        ) : (
          /* Fallback for other exam types */
          <div className="text-center p-8">Generic Exam View</div>
        )}
      </main>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeSection < 3 ? `Nộp bài phần ${activeSection}?` : "Nộp bài thi?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {activeSection < 3
                ? `Bạn có chắc chắn muốn nộp bài phần ${activeSection} không? Bạn sẽ không thể quay lại phần này.`
                : "Bạn có chắc chắn muốn nộp bài không? Hành động này không thể hoàn tác."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {activeSection < 3 ? `Nộp & Sang phần ${activeSection + 1}` : "Nộp bài"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Warning Dialog */}
      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo thời gian
            </AlertDialogTitle>
            <AlertDialogDescription>
              Chỉ còn 5 phút!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowTimeWarning(false)}>Đã hiểu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamTaking;
