import React, {useState, useEffect} from "react";
import axios from "axios";
import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";

function App()
{
	const [problems, setProblems] = useState([]);
	const [mostSolved, setMostSolved] = useState(null);
	const [leastSolved, setLeastSolved] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios('http://localhost:5000/problems');
			const problemData = response.data;
			// console.log(problemData);

			setProblems(problemData);

			const mostSolvedProblem = problemData.reduce((max, p) => p.solvedCount > max.solvedCount ? p : max, problemData[0]);
			const leastSolvedProblem = problemData.reduce((min, p) => p.solvedCount < min.solvedCount ? p : min, problemData[0]);

			setMostSolved(mostSolvedProblem);
			setLeastSolved(leastSolvedProblem);
		};

		fetchData();
	}, []);

	return (
		<div style={{padding: '20px'}}>
			<h1>Project Euler Problem Statistics</h1>
			
			<ScatterChart width={800} height={400} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
				<CartesianGrid/>
				<XAxis type="number" dataKey="id" name="Problem ID"/>
				<YAxis type="number" dataKey="solvedCount" name="Solved Count" scale="log" domain={[1, 'auto']}/>
				<Tooltip cursor={{strokeDasharray: '3 3'}}/>
				<Legend/>
				<Scatter name="Problems" data={problems} fill="#8884d8"/>
			</ScatterChart>

			<h2>Most Solved Problem</h2>
			{mostSolved && (
				<div>
					<p>Problem ID: {mostSolved.id}</p>
					<p>Title: {mostSolved.title}</p>
					<p>Number of Solvers: {mostSolved.solvedCount}</p>
				</div>
			)}

			<h2>Least Solved Problem</h2>
			{leastSolved && (
				<div>
				<p>Problem ID: {leastSolved.id}</p>
				<p>Title: {leastSolved.title}</p>
				<p>Number of Solvers: {leastSolved.solvedCount}</p>
				</div>
			)}

			<h2>All Problems Data</h2>
			<table>
				<thead>
					<tr>
						<th>Problem ID</th>
						<th>Title</th>
						<th>Solvers Count</th>
					</tr>
				</thead>
				<tbody>
					{problems.map((problem) => (
						<tr key={problem.id}>
						<td>{problem.id}</td>
						<td>{problem.title}</td>
						<td>{problem.solvedCount}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default App;
