"""
Base Agent Class
모든 에이전트의 기본 클래스
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from openai import OpenAI
import json

from config import settings


class BaseAgent(ABC):
    """
    기본 에이전트 클래스
    모든 Agent Zone의 에이전트가 상속받아 사용
    """
    
    def __init__(self, name: str, description: str):
        """
        에이전트 초기화
        
        Args:
            name: 에이전트 이름
            description: 에이전트 설명
        """
        self.name = name
        self.description = description
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        self.temperature = settings.agent_temperature
        self.max_tokens = settings.agent_max_tokens
    
    @abstractmethod
    def get_system_prompt(self) -> str:
        """
        시스템 프롬프트 반환
        각 에이전트별로 구현 필요
        """
        pass
    
    @abstractmethod
    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        """
        사용자 프롬프트 생성
        입력 데이터를 기반으로 프롬프트 생성
        """
        pass
    
    def call_gpt(
        self, 
        user_prompt: str,
        system_prompt: Optional[str] = None,
        json_mode: bool = False
    ) -> str:
        """
        GPT API 호출
        
        Args:
            user_prompt: 사용자 프롬프트
            system_prompt: 시스템 프롬프트 (없으면 기본값 사용)
            json_mode: JSON 응답 모드 활성화
            
        Returns:
            GPT 응답 텍스트
        """
        messages = [
            {"role": "system", "content": system_prompt or self.get_system_prompt()},
            {"role": "user", "content": user_prompt}
        ]
        
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }
        
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}
        
        try:
            response = self.client.chat.completions.create(**kwargs)
            return response.choices[0].message.content
        except Exception as e:
            print(f"[{self.name}] GPT API Error: {e}")
            raise
    
    def call_gpt_json(self, user_prompt: str, system_prompt: Optional[str] = None) -> Dict:
        """
        GPT API 호출 (JSON 응답)
        
        Returns:
            파싱된 JSON 딕셔너리
        """
        response = self.call_gpt(user_prompt, system_prompt, json_mode=True)
        return json.loads(response)
    
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        에이전트 실행
        
        Args:
            input_data: 입력 데이터
            
        Returns:
            처리 결과
        """
        print(f"[{self.name}] Executing with input: {list(input_data.keys())}")
        
        user_prompt = self.get_user_prompt(input_data)
        result = self.call_gpt_json(user_prompt)
        
        print(f"[{self.name}] Completed successfully")
        return result
    
    def __repr__(self):
        return f"<{self.__class__.__name__}(name='{self.name}')>"
