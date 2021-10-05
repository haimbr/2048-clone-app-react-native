import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Button, Text, Alert } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { createRandomTile, generateBoardMatrix, isGameOver, moveTiles } from '../gameLogics';
import Tile from './Tile';


const getTilesArr = (board) => {
    return [].concat(...board)
}



export default function Board() {

    useEffect(() => {
        startNewGame();
    }, [])

    const [board, setBoard] = useState([]);
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);

    const startNewGame = () => {
        let newBoard = generateBoardMatrix();
        newBoard = [...createRandomTile(newBoard)];
        setScore(0);
        setBoard(newBoard);
    }




    const handleSwipe = (direction) => {
        let { newBoard, newScore } = moveTiles(board, direction);
        if (score + newScore > maxScore) setMaxScore(score + newScore);
        setScore((prevScore) => prevScore + newScore);
        setBoard(newBoard);
        if (isGameOver(newBoard)) {
            Alert.alert(
                'GAME OVER!',
                `YOUR FINAL SCORE IS ${score}`,
                [
                    { text: 'start new game', style: 'destructive', onPress: startNewGame },
                    { text: 'OK', style: 'destructive' }
                ]
            )
        }
    }



    return (
        <GestureRecognizer
            onSwipeUp={() => handleSwipe('up')}
            onSwipeDown={() => handleSwipe('down')}
            onSwipeLeft={() => handleSwipe('left')}
            onSwipeRight={() => handleSwipe('right')}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>2048</Text>
                        <Text style={styles.descriptionTitle}>Play 2048 Game Online</Text>
                        <Text style={styles.description}>Join the numbers and get to the 2048 tile!</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={styles.scoreContainer}>
                            <View style={{ ...styles.scoreBox, width: 55 }}>
                                <Text style={styles.scoreTitle}>SCORE</Text>
                                <Text style={styles.score}>{score}</Text>
                            </View>
                            <View style={{ ...styles.scoreBox, width: 75 }}>
                                <Text style={styles.scoreTitle}>BEST</Text>
                                <Text style={styles.score}>{maxScore}</Text>
                            </View>
                        </View>
                        <Button onPress={startNewGame} title="New Game" />
                    </View>



                </View>

                <View style={styles.board}>
                    {new Array(16).fill().map((cell, index) => (
                        <View key={index} style={styles.cell}>
                        </View>
                    ))}
                    {getTilesArr(board).map((cell, index) => (
                        cell ? <Tile key={cell.id} cell={cell} /> : null
                    ))}
                </View>
            </View>
        </GestureRecognizer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf8ef',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        width: 370,
        justifyContent: 'space-between',
        marginBottom: 25
    },
    headerLeft: {
        alignItems: 'baseline',
        justifyContent: 'flex-start',
    },

    title: {
        fontSize: 50,
        lineHeight: 53,
        margin: 0,
        color: '#776e65'
    },
    descriptionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#776e65'
    },
    description: {
        fontSize: 12,
        color: '#776e65'
    },
    headerRight: {
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    scoreContainer: {
        flexDirection: 'row',
    },
    scoreBox: {
        backgroundColor: '#bbada0',
        marginLeft: 5,
        marginBottom: 10,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
    },
    scoreTitle: {
        fontSize: 10,
        color: "#eee4da",
        fontWeight: 'bold'
    },
    score: {
        color: "#fff"
    },
    board: {
        position: 'relative',
        height: 365,
        width: 365,
        backgroundColor: '#bbada0',
        flexWrap: 'wrap',
        borderWidth: 2,
        borderColor: '#bbada0',
    },
    cell: {
        width: 90,
        height: 90,
        backgroundColor: '#cdc1b4',
        borderColor: '#bbada0',
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },

});
